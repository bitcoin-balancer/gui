import { useMemo } from 'react';
import {
  LabelList,
  Pie,
  PieChart,
  Bar,
  BarChart,
  XAxis,
  YAxis,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
} from 'recharts';
import { calculatePercentageRepresentation } from 'bignumber-utils';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/shadcn/components/ui/chart.jsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
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
  },
  bids: {
    label: 'Bids',
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
      className='flex flex-col md:flex-row md:gap-10 justify-center items-start'
    >

      <div
        className='w-full flex-1'
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
            >Total liquidity</h3>
            <span className='flex-1'></span>
            <Badge>{totalLiquidity}</Badge>
          </div>
          <ChartContainer
            config={LIQUIDITY_CHART_CONFIG}
            className='mx-auto aspect-square max-h-[315px]'
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
                  { side: 'bids', liquidity: state.bids.total, fill: ColorService.INCREASE_1 },
                  { side: 'asks', liquidity: state.asks.total, fill: ColorService.DECREASE_1 },
                ]}
              >
                <LabelList
                  dataKey='liquidity'
                  fill='#FFFFFF'
                  className='font-bold'
                  stroke='none'
                  fontSize={13}
                  formatter={(value: number) => formatBitcoinAmount(value, 2)}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        </article>

        <Separator className='my-10 md:hidden' />


        {/* ***************
          * BID DOMINANCE *
          *************** */}
        <article>
          <div
            className='flex justify-start items-center'
          >
            <h3
              className='text-base font-medium'
            >Bids</h3>
            <span className='flex-1'></span>
          </div>

          <ChartContainer
            config={{
              bidDominance: { label: 'Bid dominance' },
              askDominance: { label: 'Ask dominance' },
            }}
            className='mx-auto aspect-square w-full max-w-[250px] max-h-[200px]'
          >
            <RadialBarChart
              data={[{ bidDominance: state.bidDominance, askDominance: 100 - state.bidDominance }]}
              endAngle={180}
              innerRadius={80}
              outerRadius={130}
            >
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text x={viewBox.cx} y={viewBox.cy} textAnchor='middle'>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) - 16}
                            className='fill-foreground text-2xl font-bold'
                          >
                            {`${state.bidDominance}%`}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 4}
                            className='fill-muted-foreground'
                          >
                            Dominance
                          </tspan>
                        </text>
                      );
                    }
                    return undefined;
                  }}
                />
              </PolarRadiusAxis>
              <RadialBar
                isAnimationActive={false}
                dataKey='askDominance'
                fill={ColorService.DECREASE_1}
                stackId='a'
                cornerRadius={5}
                className='stroke-transparent stroke-2'
              />
              <RadialBar
                isAnimationActive={false}
                dataKey='bidDominance'
                stackId='a'
                cornerRadius={5}
                fill={ColorService.INCREASE_1}
                className='stroke-transparent stroke-2'
              />
            </RadialBarChart>
          </ChartContainer>
        </article>


      </div>


      {/* <Separator className='mb-10 -mt-10 md:hidden' /> */}
      <Separator className='my-10 md:hidden' />


      {/* *******
        * PEAKS *
        ******* */}
      <div
        className='w-full flex-1'
      >

        {/* ******
          * BIDS *
          ****** */}
        <article>
          <div
            className='flex justify-start items-center mb-5'
          >
            <h3
              className='text-base font-medium'
            >Bid peaks</h3>
            <span className='flex-1'></span>
            <Badge className='bg-increase-1'>185</Badge>
          </div>

          <ChartContainer
            config={{ askPeaks: { label: 'Bid peaks' } }}
            className='max-h-[200px]'
          >
            <BarChart
              accessibilityLayer
              data={[
                { intensity: 'Low', count: 18 },
                { intensity: 'Medium', count: 11 },
                { intensity: 'High', count: 7 },
                { intensity: 'V. high', count: 3 },
              ]}
              layout='vertical'
            >
              <XAxis type='number' dataKey='count' hide />
              <YAxis
                dataKey='intensity'
                type='category'
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                isAnimationActive={false}
                dataKey='count'
                fill={ColorService.INCREASE_1}
                radius={5}
              />
            </BarChart>
          </ChartContainer>
        </article>

        <Separator className='my-10 md:hidden' />

        {/* ******
          * ASKS *
          ****** */}
        <article
          className='md:mt-7'
        >
          <div
            className='flex justify-start items-center mb-5'
          >
            <h3
              className='text-base font-medium'
            >Ask peaks</h3>
            <span className='flex-1'></span>
            <Badge className='bg-decrease-1'>{totalLiquidity}</Badge>
          </div>

          <ChartContainer
            config={{ askPeaks: { label: 'Bid peaks' } }}
            className='max-h-[200px]'
          >
            <BarChart
              accessibilityLayer
              data={[
                { intensity: 'Low', count: 18 },
                { intensity: 'Medium', count: 11 },
                { intensity: 'High', count: 7 },
                { intensity: 'V. high', count: 3 },
              ]}
              layout='vertical'
            >
              <XAxis type='number' dataKey='count' hide />
              <YAxis
                dataKey='intensity'
                type='category'
                tickLine={false}
                axisLine={false}
              />
              <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              />
              <Bar
                isAnimationActive={false}
                dataKey='count'
                fill={ColorService.DECREASE_1}
                radius={5}
              />
            </BarChart>
          </ChartContainer>
        </article>

      </div>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LiquiditySummary;
