import { memo, useState, useEffect, useCallback, useMemo } from 'react';
import { prettifyValue } from 'bignumber-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { IInfoDialogConfig } from '@/shared/store/slices/info-dialog/types.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ISplitStateID, ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
import {
  formatDate,
  formatDollarAmount,
  formatSplitStateChanges,
} from '@/shared/services/transformers/index.service.ts';
import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import {
  IModuleID,
  IComponentProps,
  ISplitStatesDialogData,
} from '@/pages/app/dashboard/split-states-dialog/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Prettifies a price based on the asset pair (if any).
 * @param price
 * @param asset
 * @returns string
 */
const prettifyPrice = (price: number, asset: ICoinStateAsset | undefined): string => {
  switch (asset) {
    case 'quote':
      return formatDollarAmount(price, 16);
    case 'base':
      return prettifyValue(price, { processing: { decimalPlaces: 16 }, format: { prefix: '₿' } });
    default:
      return formatDollarAmount(price, 0);
  }
};

/**
 * Builds the content that will be inserted in the info dialog.
 * @param id
 * @param window
 * @returns IInfoDialogConfig
 */
const buildInfoDialogContent = (
  id: IModuleID,
  window: ISplitStateItem[],
  asset: ICoinStateAsset | undefined,
  assetName: string,
  symbol: string | undefined,
): IInfoDialogConfig => ({
  title: id === 'WINDOW' ? 'Window Snapshot' : `${symbol}/${assetName} Snapshot`,
  content: [
    `DATE RANGE (${window.length} items)`,
    `${formatDate(window[0].x, 'datetime-medium')}`,
    `${formatDate(window[window.length - 1].x, 'datetime-medium')}`,
    '-----',
    'CURRENT PRICE',
    prettifyPrice(window[window.length - 1].y, asset),
  ],
});

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Split States Dialog Component
 * Component in charge of displaying additional information regarding each of the window splits.
 */
const SplitStatesDialog = memo(
  ({
    data: { moduleID, moduleState, activeID = 's100', asset, symbol },
    closeDialog,
  }: IComponentProps) => {
    /* **********************************************************************************************
     *                                             STATE                                            *
     ********************************************************************************************** */
    const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
    const breakpoint = useMediaQueryBreakpoint();
    const [activeSplitID, setActiveSplitID] = useState<ISplitStateID>(activeID);
    const [activeSplit, setActiveSplit] = useState<ISplitStateItem[]>([]);
    const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
    const openInfoDialog = useBoundStore((state) => state.openInfoDialog);

    /* **********************************************************************************************
     *                                       REACTIVE VALUES                                        *
     ********************************************************************************************** */

    // the name of the asset
    const assetName = asset === 'quote' ? exchangeConfig.quoteAsset : exchangeConfig.baseAsset;

    // the dialog's title
    const title = moduleID === 'COINS' ? `${symbol}/${assetName}` : 'Window';

    // the percentage change experienced by each split
    const splitChanges = useMemo(
      () => formatSplitStateChanges(moduleState.splitStates),
      [moduleState.splitStates],
    );

    // the price formatter that will be used on the chart
    const priceFormatter = useCallback((value: number) => prettifyPrice(value, asset), [asset]);

    /* **********************************************************************************************
     *                                        EVENT HANDLERS                                        *
     ********************************************************************************************** */

    /**
     * Activates a Split ID based on the window state prop.
     * @param id
     */
    const activateSplit = useCallback(
      (id: ISplitStateID): void => {
        setActiveSplitID(id);
        setActiveSplit(MarketStateService.applySplit(moduleState.window, id) as ISplitStateItem[]);
      },
      [moduleState.window],
    );

    /**
     * Displays the information dialog which describes how to the window module operates.
     */
    const displayWindowInfo = (): void => {
      openInfoDialog(
        buildInfoDialogContent(moduleID, moduleState.window, asset, assetName, symbol),
      );
    };

    /* **********************************************************************************************
     *                                         SIDE EFFECTS                                         *
     ********************************************************************************************** */

    /**
     * Activates the initial split based on the ID prop.
     */
    useEffect(() => {
      activateSplit(activeID);
    }, [activeID, activateSplit]);

    /* **********************************************************************************************
     *                                           COMPONENT                                          *
     ********************************************************************************************** */
    return (
      <Dialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-[900px]">
          {/* ***************
           * DIALOG HEADER *
           *************** */}
          <DialogHeader>
            <DialogTitle>
              <button
                className="flex justify-center sm:justify-start items-center"
                onClick={displayWindowInfo}
              >
                {title}
                <StateIcon
                  className="ml-2"
                  state={moduleState.state}
                />
              </button>
            </DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {/* *************
           * SPLIT TILES *
           ************* */}
          <div className="grid grid-cols-4 gap-1 w-full">
            {MarketStateService.SPLITS.map((split) => (
              <button
                key={split}
                onClick={() => activateSplit(split)}
                className={` py-2 px-0 sm:px-2 ${ColorService.STATE_BG_CLASS_NAME[moduleState.splitStates[split].state]} ${activeSplitID === split ? 'opacity-60' : 'hover:opacity-80'}`}
                disabled={activeSplitID === split}
              >
                <p className="text-white text-sm font-semibold">{splitChanges[split]}</p>
                <p className="text-white text-xs font-bold">
                  {MarketStateService.SPLIT_NAMES[split]}
                </p>
              </button>
            ))}
          </div>

          {/* *******
           * CHART *
           ******* */}
          <LineChart
            key={activeSplitID}
            kind="area"
            height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
            data={activeSplit}
            state={moduleState.splitStates[activeSplitID].state}
            priceFormatterFunc={moduleID === 'WINDOW' ? priceFormatter : undefined}
          />
        </DialogContent>
      </Dialog>
    );
  },
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SplitStatesDialog;
export type { ISplitStatesDialogData };
