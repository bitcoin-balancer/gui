import { useMemo } from 'react';
import { LabelList, Pie, PieChart } from 'recharts';
import { calculatePercentageRepresentation } from 'bignumber-utils';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/shadcn/components/ui/chart.jsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { formatBitcoinAmount } from '@/shared/services/transformers/index.service.ts';
import { ILiquidityState } from '@/shared/backend/market-state/liquidity/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';

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
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity Summary Component
 * Component in charge of displaying the summary of the liquidity state.
 */
const LiquiditySummary = ({ state }: { state: ILiquidityState }) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the total base asset liquidity
  const __totalLiquidity = state ? state.asks.total + state.bids.total : 0;
  const totalLiquidity = useMemo(
    () => (formatBitcoinAmount(__totalLiquidity, 3)),
    [__totalLiquidity],
  );

  // percentage representation of the liquidity by side
  const liquidityPercentageBySide = useMemo(
    () => (
      state
        ? {
          asks: calculatePercentageRepresentation(state.asks.total, __totalLiquidity),
          bids: calculatePercentageRepresentation(state.bids.total, __totalLiquidity),
        }
        : { asks: 0, bids: 0 }
    ),
    [state, __totalLiquidity],
  );



  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div
      className='grid grid-cols-1 sm:grid-cols-2 gap-4'
    >

      {/* *******
        * TOTAL *
        ******* */}
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
              isAnimationActive={false}
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
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LiquiditySummary;
