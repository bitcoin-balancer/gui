import { addMinutes } from 'date-fns';
import { ChartOptions, DeepPartial } from 'lightweight-charts';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { IState } from '@/shared/backend/market-state/shared/types.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import {
  ICandlestickBar,
  IPriceFormatterFunc,
} from '@/shared/components/charts/candlestick-chart/types.ts';
import { toLocalTime } from '@/shared/components/charts/shared/utils.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Converts a record for compact candlesticks into bars, ready to be rendered.
 * @param records
 * @returns ICandlestickBar[]
 */
const toBars = (records: ICompactCandlestickRecords): ICandlestickBar[] => records.id.map(
  (value, idx) => ({
    time: toLocalTime(value),
    open: records.open[idx],
    high: records.high[idx],
    low: records.low[idx],
    close: records.close[idx],
  }),
);

/**
 * Builds the essential options for creating a candlesticks chart.
 * @param chartContainerEl
 * @param height
 * @param priceFormatterFunc
 * @param showAttributionLogo
 * @param hideTimeScale
 * @param hideRightPriceScale
 * @param hideCrosshair
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
    fontFamily: 'Ubuntu',
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
 * Determines the up and down color based on the current state of the market state module.
 * @param state
 * @returns { upColor: string, downColor: string }
 */
const getBarColorsByState = (state: IState | undefined): { upColor: string, downColor: string } => {
  if (state === 2) {
    return { upColor: ColorService.INCREASE_2, downColor: ColorService.INCREASE_0 };
  }
  if (state === -2) {
    return { upColor: ColorService.DECREASE_0, downColor: ColorService.DECREASE_2 };
  }
  return { upColor: ColorService.INCREASE_1, downColor: ColorService.DECREASE_1 };
};

/**
 * Verifies if the chart should be rendered a new. Useful for situations where data may have been
 * lost due to the app being in the background.
 * @param refreshFrequency
 * @param lastRefresh
 * @returns boolean
 */
const shouldChartBeRefreshed = (
  refreshFrequency: number | undefined,
  lastRefresh: number | undefined,
): boolean => (
  typeof refreshFrequency === 'number'
  && typeof lastRefresh === 'number'
  && Date.now() > addMinutes(lastRefresh, refreshFrequency).valueOf()
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toBars,
  buildChartOptions,
  getBarColorsByState,
  shouldChartBeRefreshed,
};
