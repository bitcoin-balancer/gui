import { memo, useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';
import { calculatePercentageRepresentation } from 'bignumber-utils';
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
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
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
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/indicators/liquidity-state-dialog/types.ts';

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
    color: ColorService.SLATE.H100,
  },
  bids: {
    label: 'Bids',
    color: ColorService.SLATE.H100,
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





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the total base asset liquidity
  const __totalLiquidity = data ? data.asks.total + data.bids.total : 0;
  const totalLiquidity = useMemo(
    () => (formatBitcoinAmount(__totalLiquidity, 3)),
    [__totalLiquidity],
  );

  // percentage representation of the liquidity by side
  const liquidityPercentageBySide = useMemo(
    () => (
      data
        ? {
          asks: calculatePercentageRepresentation(data.asks.total, __totalLiquidity),
          bids: calculatePercentageRepresentation(data.bids.total, __totalLiquidity),
        }
        : { asks: 0, bids: 0 }
    ),
    [data, __totalLiquidity],
  );



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
      <Tabs
        defaultValue='summary'
        className='w-full'
      >
        <TabsList
          className='grid w-full grid-cols-3'
        >
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='peaks'>Peaks</TabsTrigger>
          <TabsTrigger value='levels'>Levels</TabsTrigger>
        </TabsList>


        {/* *********
          * SUMMARY *
          ********* */}

        <TabsContent
          value='summary'
          className='p-3'
        >
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
                <Badge>{totalLiquidity}</Badge>
              </div>
              <ChartContainer
                config={LIQUIDITY_CHART_CONFIG}
                className='mx-auto aspect-square max-h-[300px]'
              >
                <PieChart>
                  <ChartTooltip
                    content={<ChartTooltipContent nameKey='side' hideLabel />}
                  />
                  <Pie
                    dataKey='liquidity'
                    nameKey='side'
                    data={[
                      { side: 'asks', liquidity: liquidityPercentageBySide.asks, fill: ColorService.DECREASE_1 },
                      { side: 'bids', liquidity: liquidityPercentageBySide.bids, fill: ColorService.INCREASE_1 },
                    ]}
                  >
                    <LabelList
                      dataKey='liquidity'
                      className='text-black'
                      style={{ color: '#FFFFFF' }}
                      stroke='none'
                      fontSize={12}
                      formatter={(value: string) => `${value}%`}
                    />
                  </Pie>
                </PieChart>
              </ChartContainer>
            </article>




          </div>
        </TabsContent>

        {/* *******
          * PEAKS *
          ******* */}
        <TabsContent
          value='peaks'
          className='p-3'
        >
          <p>Peaks</p>
        </TabsContent>


        {/* *******
          * LEVELS *
          ******* */}
        <TabsContent
          value='levels'
          className='p-3'
        >
          <p>Levels</p>
        </TabsContent>
      </Tabs>
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
