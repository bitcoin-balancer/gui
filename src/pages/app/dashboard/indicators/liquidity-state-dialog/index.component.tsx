import { memo, useMemo } from 'react';
import { Pie, PieChart } from 'recharts';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/shadcn/components/ui/chart.jsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
} from '@/shared/services/transformers/index.service.ts';
import { IInfoDialogConfig } from '@/shared/store/slices/info-dialog/types.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  LiquidityService,
  ILiquidityState,
} from '@/shared/backend/market-state/liquidity/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/indicators/liquidity-state-dialog/types.ts';
import { ColorService } from '@/shared/services/color/index.service';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the configuration that will be used to render the liquidity chart
const LIQUIDITY_CHART_CONFIG = {
  liquidity: {
    label: 'Liquidity',
  },
  asks: {
    label: 'Asks',
    color: ColorService.DECREASE_1,
  },
  bids: {
    label: 'Bids',
    color: ColorService.INCREASE_1,
  },
} satisfies ChartConfig;




/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the content that will be inserted in the info dialog.
 * @param state
 * @returns IInfoDialogConfig
 */
const buildInfoDialogContent = (state: ILiquidityState): IInfoDialogConfig => ({
  title: 'Liquidity Snapshot',
  content: [
    'LAST REFETCH',
    formatDate(state.lastRefetch, 'datetime-medium'),
    '-----',
    'PRICE RANGE',
    `Upper: ${formatDollarAmount(state.priceRange.upper)}`,
    `Current: ${formatDollarAmount(state.priceRange.current)}`,
    `Lower: ${formatDollarAmount(state.priceRange.lower)}`,
    '-----',
    'INTENSITY REQUIREMENTS',
    `Low: ${formatBitcoinAmount(state.intensityRequirements.low)}`,
    `Medium: ${formatBitcoinAmount(state.intensityRequirements.medium)}`,
    `High: ${formatBitcoinAmount(state.intensityRequirements.high)}`,
    `Very high: ${formatBitcoinAmount(state.intensityRequirements.veryHigh)}`,
  ],
});





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity State Dialog Component
 * Component in charge of displaying the current state of the liquidity.
 */
const LiquidityStateDialog = memo(({ closeDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<ILiquidityState>(useMemo(
    () => ({
      fetchFunc: { func: LiquidityService.getState },
    }),
    [],
  ));
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);

  console.log(data);



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the informational dialog for the current snapshot.
   */
  const displayLiquidityInfo = (): void => openInfoDialog(buildInfoDialogContent(data));





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
      <div
        className='grid grid-cols-1 sm:grid-cols-2 gap-4'
      >

        {/* ***********
          * LIQUIDITY *
          *********** */}
        <article>
          <div
            className='flex justify-start items-center'
          >
            <h3
              className='text-base font-medium'
            >Total</h3>
            <span className='flex-1'></span>
            <Badge>{data.asks.total + data.bids.total} {exchangeConfig.baseAsset}</Badge>
          </div>
          <ChartContainer
            config={LIQUIDITY_CHART_CONFIG}
          >
            <PieChart>
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Pie
                dataKey='liquidity'
                nameKey='side'
                data={[
                  { side: 'asks', liquidity: data.asks.total, fill: ColorService.DECREASE_1 },
                  { side: 'bids', liquidity: data.bids.total, fill: ColorService.INCREASE_1 },
                ]}
                height={250}
              />
            </PieChart>
          </ChartContainer>
        </article>




      </div>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[900px]'
      >

        <DialogHeader>
          <DialogTitle>
            <button
              aria-label='Display liquidity information'
              onClick={displayLiquidityInfo}
            >
              Liquidity
            </button>
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
export default LiquidityStateDialog;
