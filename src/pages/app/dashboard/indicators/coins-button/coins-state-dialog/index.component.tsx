import { memo, useState, useMemo, Fragment } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { CoinsService } from '@/shared/backend/market-state/coins/index.service.ts';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { toLineSeries } from '@/shared/backend/market-state/shared/utils.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/indicators/coins-button/coins-state-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins State Dialog Component
 * Component in charge of displaying a line chart for each coin for an asset.
 */
const CoinsStateDialog = memo(({ asset, openSplitStatesDialog, closeDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => CoinsService.getSemiCompactStateForAsset(asset),
      }),
      [asset],
    ),
  );
  const [retrievingState, setRetrievingState] = useState<boolean>(false);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const breakpoint = useMediaQueryBreakpoint();

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the name of the asset
  const assetName = asset === 'quote' ? exchangeConfig.quoteAsset : exchangeConfig.baseAsset;

  // the list of symbols present in the states object
  const topSymbols = useMemo(() => (data ? Object.keys(data.statesBySymbol).sort() : []), [data]);

  // the list of charts that will be rendered
  const charts = useMemo(
    () => topSymbols.map((symbol) => toLineSeries(data.statesBySymbol[symbol].splitStates)),
    [topSymbols, data],
  );

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the split states for a symbol.
   * @param symbol
   * @returns Promise<void>
   */
  const displaySplitStatesDialog = async (symbol: string): Promise<void> => {
    if (!retrievingState) {
      setRetrievingState(true);
      try {
        const state = await CoinsService.getStateForSymbol(asset, symbol);
        openSplitStatesDialog({
          moduleID: 'COINS',
          asset,
          symbol,
          moduleState: state,
        });
      } catch (e) {
        errorToast(e);
      }
      setRetrievingState(false);
    }
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = (
      <PageLoadError
        variant="dialog"
        error={error}
      />
    );
  } else if (loading) {
    content = <PageLoader variant="dialog" />;
  } else {
    content = (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 md:grid-cols-4 animate-in fade-in duration-700">
        {topSymbols.map((symbol, i) => (
          <Fragment key={symbol}>
            <div>
              <Card
                role="button"
                aria-label={`Display the split states dialog for ${symbol}`}
                tabIndex={1}
                className={`hover:ring-1 hover:ring-slate-300 ${retrievingState ? 'hover:cursor-not-allowed opacity-50 ' : 'hover:pointer'}`}
                onClick={() => displaySplitStatesDialog(symbol)}
              >
                <CardContent className="md:pt-0 md:p-2 relative">
                  <span
                    className={`absolute top-1 left-1/2 transform -translate-x-1/2 z-10 text-base font-semibold ${ColorService.STATE_TEXT_CLASS_NAME[data.statesBySymbol[symbol].state]}`}
                  >
                    {symbol}
                  </span>
                  <LineChart
                    kind="line"
                    height={breakpoint === 'xs' || breakpoint === 'sm' ? 200 : 150}
                    data={charts[i]}
                    state={data.statesBySymbol[symbol].state}
                    showAttributionLogo={false}
                    hideTimeScale={true}
                    hideRightPriceScale={true}
                    hideCrosshair={true}
                    hideCrosshairMarker={true}
                    hidePriceLine={true}
                    disableScrollHandler={true}
                    disableScaleHandler={true}
                  />
                </CardContent>
              </Card>
              {i < topSymbols.length - 1 && <Separator className="my-7 block md:hidden" />}
            </div>
          </Fragment>
        ))}
      </div>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className="max-w-[1000px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center sm:justify-start items-center">
            COINS/{assetName}
            {!error && !loading && !retrievingState && (
              <StateIcon
                className="ml-2"
                state={data.state}
              />
            )}
            {retrievingState && <Loader2 className="ml-2 h-4 w-4 animate-spin" />}
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CoinsStateDialog;
