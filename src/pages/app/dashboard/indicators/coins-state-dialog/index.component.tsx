import { memo, useState, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  CoinsService,
  ICoinsState,
  ISemiCompactCoinState,
} from '@/shared/backend/market-state/coins/index.service.ts';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { toLineSeries } from '@/shared/backend/market-state/shared/utils.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/indicators/coins-state-dialog/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the current time in ms
const currentTime = Date.now();





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins State Dialog Component
 * Component in charge of displaying a line chart for each coin for an asset.
 */
const CoinsStateDialog = memo(({ asset, closeDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch<ICoinsState<ISemiCompactCoinState>>(useMemo(
    () => ({
      fetchFunc: { func: CoinsService.getSemiCompactStateForAsset, args: [asset] },
    }),
    [asset],
  ));
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the name of the asset
  const assetName = asset === 'quote' ? exchangeConfig.quoteAsset : exchangeConfig.baseAsset;

  // the list of symbols present in the states object
  const topSymbols = useMemo(
    () => (data ? Object.keys(data.statesBySymbol).sort() : []),
    [data],
  );

  //
  const charts = useMemo(
    () => topSymbols.map((symbol) => toLineSeries(
      data.statesBySymbol[symbol].splitStates,
      currentTime,
    )),
    [topSymbols, data],
  );





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

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

  // ...





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
      <div className='grid grid-cols-1 gap-6 sm:grid-cols-4 animate-in fade-in duration-700'>
        {topSymbols.map((symbol, i) => (
          <Card key={symbol}>
            <CardContent
              className='md:pt-0 md:p-1 relative'
            >
              <span
                className={`absolute top-1 left-1/2 transform -translate-x-1/2 z-10 text-base font-semibold ${ColorService.STATE_TEXT_CLASS_NAME[data.statesBySymbol[symbol].state]}`}
              >{symbol}</span>
              <LineChart
                kind='line'
                height={150}
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
        ))}
      </div>
    );
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[900px]'
      >

        {/* ***************
          * DIALOG HEADER *
          *************** */}
        <DialogHeader>
          <DialogTitle
            className='flex justify-center sm:justify-start items-center'
          >
            COINS/{assetName}
            {
              (!error && !loading)
                && <StateIcon
                className='ml-2'
                state={data.state}
              />
            }
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
