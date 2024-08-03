/* import { useMemo } from 'react'; */
import { Label, Pie, PieChart as PieChartAPI } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../../shared/shadcn/components/ui/chart.tsx';


type IComponentProps = {
  className: string;
  valueLabel: string;
};


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Pie Chart Component
 * Component in charge of ...
 */
const PieChart = ({
  className = 'max-h-[180px]',
  valueLabel = 'Value',
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */

  // ...



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */


  const chartData = [
    { memory: 'active', value: 275, fill: '#0C0C0C' },
    { memory: 'free', value: 200, fill: '#f1f5f9' },
  ];





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <ChartContainer config={{ value: { label: valueLabel }, active: { label: 'Active', color: '#0C0C0C' }, free: { label: 'Free', color: '#f1f5f9' } }} className={`mx-auto aspect-square ${className}`}>
      <PieChartAPI>
        <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
        <Pie
          data={[
            { memory: 'active', value: data.memory.active, fill: '#0C0C0C' },
            { memory: 'free', value: data.memory.free, fill: '#f1f5f9' },
          ]}
          dataKey='value'
          nameKey='memory'
          innerRadius={60}
          strokeWidth={5}
          >
          <Label content={({ viewBox }) => {
            if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
              return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor='middle'
                    dominantBaseline='middle'
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className='fill-foreground text-3xl font-bold'
                    >
                      {data.memory.usage}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className='fill-muted-foreground'
                    >
                      Usage%
                    </tspan>
                  </text>
              );
            }
            return undefined;
          }}
          />
        </Pie>
      </PieChartAPI>
    </ChartContainer>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PieChart;
