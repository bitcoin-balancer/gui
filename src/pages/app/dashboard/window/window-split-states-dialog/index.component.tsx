import {
  memo,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { prettifyValue, processValue } from 'bignumber-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { ISplitStateID, ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import StateIcon from '@/shared/components/state-icon/index.component.ts';
import { IComponentProps, IWindowStateDialogData } from '@/pages/app/dashboard/window/window-split-states-dialog/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Turns a compact candlestick records object into a list of split state items.
 * @param records
 * @returns ISplitStateItem[]
 */
const transformCompactCandlestickRecords = (
  records: ICompactCandlestickRecords,
): ISplitStateItem[] => records.id.reduce(
  (prev, current, idx) => [...prev, { x: current, y: records.close[idx] }],
  [] as ISplitStateItem[],
);

/**
 * Prettifies a split state change.
 * @param change
 * @returns string
 */
const prettifySplitChange = (change: number): string => `${change > 0 ? '+' : ''}${processValue(change, { decimalPlaces: 1 })}`;




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Split States Dialog Component
 * Component in charge of displaying additional information regarding each of the window splits.
 */
const WindowSplitStatesDialog = memo(({
  data: { activeID, windowState },
  closeDialog,
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const [activeSplitID, setActiveSplitID] = useState<ISplitStateID>(activeID);
  const [activeSplit, setActiveSplit] = useState<ISplitStateItem[]>([]);
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the percentage change experienced by each split
  const splitChanges = useMemo(
    () => MarketStateService.SPLITS.reduce(
      (prev, current) => ({
        ...prev,
        [current]: prettifySplitChange(windowState.splitStates[current].change),
      }),
      {} as { [key in ISplitStateID]: string },
    ),
    [windowState.splitStates],
  );





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
      setActiveSplit(
        MarketStateService.applySplit(
          transformCompactCandlestickRecords(windowState.window),
          id,
        ) as ISplitStateItem[],
      );
    },
    [windowState.window],
  );

  /**
   * Displays the information dialog which describes how to the window module operates.
   */
  const displayWindowInfo = (): void => {
    openInfoDialog({
      title: 'Window State',
      content: [
        'DATE RANGE',
        `${formatDate(windowState.window.id[0], 'datetime-medium')}`,
        `${formatDate(windowState.window.id.at(-1)!, 'datetime-medium')}`,
        '-----',
        'NUMBER OF ITEMS',
        `${windowState.window.id.length}`,
        '-----',
        'CURRENT PRICE',
        `${prettifyValue(windowState.window.close.at(-1)!, { format: { prefix: '$' } })}`,
      ],
    });
  };

  /**
   * Handles the closing of the dialog after a small delay.
   */
  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      closeDialog();
    }, 250);
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
      open={isOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[700px]'
      >

        {/* ***************
          * DIALOG HEADER *
          *************** */}
        <DialogHeader>
          <DialogTitle>
            <button
              className='flex justify-center sm:justify-start items-center'
              onClick={displayWindowInfo}
            >
            Window State
            <StateIcon
              className='ml-2'
              state={windowState.state}
            />
            </button>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>



        {/* *************
          * SPLIT TILES *
          ************* */}
        <div
          className='grid grid-cols-4 gap-1 pt-3 md:pt-0 w-full'
        >
          {MarketStateService.SPLITS.map((split) => (
            <button
              key={split}
              onClick={() => activateSplit(split)}
              className={` py-2 px-0 sm:px-2 ${ColorService.getBackgroundClassByState(windowState.splitStates[split].state)} ${activeSplitID === split ? 'opacity-60' : 'hover:opacity-80'}`}
              disabled={activeSplitID === split}
            >
              <p className='text-white text-sm font-semibold'>{splitChanges[split]}%</p>
              <p className='text-white text-xs font-bold'>{MarketStateService.SPLIT_NAMES[split]}</p>
            </button>
          ))}
        </div>


        {/* *******
          * CHART *
          ******* */}



      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowSplitStatesDialog;
export type {
  IWindowStateDialogData,
};
