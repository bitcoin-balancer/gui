import { memo } from 'react';
import { Label, Pie, PieChart as PieChartAPI } from 'recharts';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '@/shared/shadcn/components/ui/chart.tsx';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IResourcePieChartProps } from '@/pages/app/server/monitoring/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Resource Pie Chart Component
 * Component in charge of charting the % of a resource that is being used.
 */
const ResourcePieChart = memo(
  ({
    className = 'max-h-[187px]',
    valueLabel = 'Usage%',
    value,
    total = 100,
  }: IResourcePieChartProps) => (
    <ChartContainer
      config={{
        value: { label: valueLabel },
        active: { label: 'Active', color: ColorService.PRIMARY },
        available: { label: 'Available', color: ColorService.SLATE.H200 },
      }}
      className={`mx-auto aspect-square ${className}`}
    >
      <PieChartAPI>
        <ChartTooltip
          cursor={false}
          content={<ChartTooltipContent hideLabel />}
        />
        <Pie
          isAnimationActive={false}
          data={[
            { key: 'active', value, fill: ColorService.PRIMARY },
            { key: 'available', value: total - value, fill: ColorService.SLATE.H200 },
          ]}
          dataKey="value"
          nameKey="key"
          innerRadius={60}
          strokeWidth={5}
        >
          <Label
            content={({ viewBox }) => {
              if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                return (
                  <text
                    x={viewBox.cx}
                    y={viewBox.cy}
                    textAnchor="middle"
                    dominantBaseline="middle"
                  >
                    <tspan
                      x={viewBox.cx}
                      y={viewBox.cy}
                      className="fill-foreground text-3xl font-bold"
                    >
                      {value}
                    </tspan>
                    <tspan
                      x={viewBox.cx}
                      y={(viewBox.cy || 0) + 24}
                      className="fill-muted-foreground"
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
  ),
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ResourcePieChart;
