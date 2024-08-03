/* import { useMemo } from 'react'; */
import { Label, Pie, PieChart as PieChartAPI } from 'recharts';
import {
  /* ChartConfig, */
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../../shared/shadcn/components/ui/chart.tsx';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */
type IComponentProps = {
  className: string;
  valueLabel: 'Usage%' | 'Load%';
  value: number;
  total?: number;
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Resource Pie Chart Component
 * Component in charge of charting the % of a resource that is being used.
 */
const ResourcePieChart = ({
  className = 'max-h-[180px]',
  valueLabel = 'Usage%',
  value,
  total = 100,
}: IComponentProps) => (
  <ChartContainer config={{ value: { label: valueLabel }, active: { label: 'Active', color: '#0C0C0C' }, available: { label: 'Available', color: '#e2e8f0' } }} className={`mx-auto aspect-square ${className}`}>
    <PieChartAPI>
      <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
      <Pie
        data={[
          { key: 'active', value, fill: '#0C0C0C' },
          { key: 'available', value: total - value, fill: '#e2e8f0' },
        ]}
        dataKey='value'
        nameKey='key'
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
                    {value}
                  </tspan>
                  <tspan
                    x={viewBox.cx}
                    y={(viewBox.cy || 0) + 24}
                    className='fill-muted-foreground'
                  >
                    {valueLabel}
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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ResourcePieChart;
