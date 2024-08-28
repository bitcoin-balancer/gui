import {
  ChartOptions,
  DeepPartial,
  LineStyleOptions,
  AreaStyleOptions,
  SeriesOptionsCommon,
  LineSeriesPartialOptions,
} from 'lightweight-charts';
import { ISplitStateItem, IState } from '@/shared/backend/market-state/shared/types.ts';
import { toLocalTime } from '@/shared/services/transformers/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import {
  IChartKind,
  IPriceFormatterFunc,
  ISeriesItem,
} from '@/shared/components/charts/line-chart/types.ts';

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
 * @param priceFormatterFunc
 * @param showAttributionLogo
 * @param hideTimeScale
 * @param hideRightPriceScale
 * @param disableScrollHandler
 * @param disableScaleHandler
 * @returns DeepPartial<ChartOptions>
 */
const buildChartOptions = (
  chartContainerEl: HTMLDivElement,
  height: number,
  priceFormatterFunc: IPriceFormatterFunc | undefined,
  showAttributionLogo: boolean,
  hideTimeScale: boolean,
  hideRightPriceScale: boolean,
  hideCrosshair: boolean,
  disableScrollHandler: boolean,
  disableScaleHandler: boolean,
): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: 'black',
    attributionLogo: showAttributionLogo,
  },
  width: chartContainerEl.clientWidth,
  height,
  grid: { horzLines: { visible: false }, vertLines: { visible: false } },
  localization: {
    priceFormatter: priceFormatterFunc,
  },
  timeScale: {
    borderColor: ColorService.PRIMARY,
    visible: !hideTimeScale,
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: ColorService.PRIMARY,
    visible: !hideRightPriceScale,
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
      visible: !hideCrosshair,
      labelVisible: !hideCrosshair,
    },

    // Horizontal crosshair line (showing Price in Label)
    horzLine: {
      color: ColorService.PRIMARY,
      labelBackgroundColor: ColorService.PRIMARY,
      visible: !hideCrosshair,
      labelVisible: !hideCrosshair,
    },
  },
  handleScroll: !disableScrollHandler,
  handleScale: !disableScaleHandler,
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

/**
 * Builds the options object for a line/area chart.
 * @param kind
 * @param state
 * @param hidePriceLine
 * @param hideCrosshairMarker
 * @returns LineSeriesPartialOptions
 */
const buildSeriesOptions = (
  kind: IChartKind,
  state: IState | undefined,
  hidePriceLine: boolean,
  hideCrosshairMarker: boolean,
): LineSeriesPartialOptions => ({
  ...getColorByState(kind, state),
  priceLineVisible: !hidePriceLine,
  crosshairMarkerVisible: !hideCrosshairMarker,
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toSeriesItems,
  buildChartOptions,
  getColorByState,
  buildSeriesOptions,
};
