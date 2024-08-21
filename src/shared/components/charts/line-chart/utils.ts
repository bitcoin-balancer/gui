import {
  ChartOptions,
  DeepPartial,
  LineStyleOptions,
  AreaStyleOptions,
  SeriesOptionsCommon,
} from 'lightweight-charts';
import { ISplitStateItem, IState } from '@/shared/backend/market-state/index.service.ts';
import { formatDollarAmount, toLocalTime } from '@/shared/services/transformers/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IChartKind, ISeriesItem } from '@/shared/components/charts/line-chart/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Converts a list of split state items into series items, ready to be rendered.
 * @param items
 * @returns ISeriesItem[]
 */
const toSeriesItems = (items: ISplitStateItem[]): ISeriesItem[] => items.map(
  (value) => ({
    time: toLocalTime(value.x),
    value: value.y,
  }),
);

/**
 * Builds the essential options for creating a line chart.
 * @param chartContainerEl
 * @param height
 * @param prettifyY
 * @returns DeepPartial<ChartOptions>
 */
const buildChartOptions = (
  chartContainerEl: HTMLDivElement,
  height: number,
  prettifyY: boolean | undefined,
): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: 'black',
    attributionLogo: true,
  },
  width: chartContainerEl.clientWidth,
  height,
  grid: { horzLines: { visible: false }, vertLines: { visible: false } },
  localization: {
    priceFormatter: prettifyY ? (val: number) => formatDollarAmount(val, 0) : undefined,
  },
  timeScale: {
    borderColor: ColorService.PRIMARY,
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: ColorService.PRIMARY,
  },
  crosshair: {
    // change mode from default 'magnet' to 'normal'.
    // allows the crosshair to move freely without snapping to datapoints
    mode: 0,

    // Vertical crosshair line (showing Date in Label)
    vertLine: {
      width: 1,
      color: ColorService.PRIMARY,
      style: 3,
      labelBackgroundColor: ColorService.PRIMARY,
    },

    // Horizontal crosshair line (showing Price in Label)
    horzLine: {
      color: ColorService.PRIMARY,
      labelBackgroundColor: ColorService.PRIMARY,
    },
  },
});

/**
 * Determines the color object to be applied to the chart based on its kind and the current state.
 * @param state
 * @returns ILineChartColor
 */
const __getLineChartColor = (
  state: IState | undefined,
): DeepPartial<LineStyleOptions & SeriesOptionsCommon> => (
  { color: state === undefined ? ColorService.PRIMARY : ColorService.STATE[state] }
);
const __getAreaChartColor = (
  state: IState | undefined,
): DeepPartial<AreaStyleOptions & SeriesOptionsCommon> => (
  state === undefined
    ? {
      lineColor: ColorService.PRIMARY,
      topColor: ColorService.PRIMARY,
      bottomColor: `rgba(${ColorService.PRIMARY_RGB}, 0.28)`,
    }
    : {
      lineColor: ColorService.STATE[state],
      topColor: ColorService.STATE[state],
      bottomColor: `rgba(${ColorService.STATE_RGB[state]}, 0.28)`,
    }
);
const getColorByState = (
  kind: IChartKind,
  state: IState | undefined,
): DeepPartial<(LineStyleOptions | AreaStyleOptions) & SeriesOptionsCommon> => (
  kind === 'line' ? __getLineChartColor(state) : __getAreaChartColor(state)
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toSeriesItems,
  buildChartOptions,
  getColorByState,
};
