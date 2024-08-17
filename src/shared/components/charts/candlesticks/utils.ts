import { UTCTimestamp, ChartOptions, DeepPartial } from 'lightweight-charts';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { ICandlestickBar } from '@/shared/components/charts/candlesticks/types.ts';


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
    time: value / 1000 as UTCTimestamp,
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
 * @returns DeepPartial<ChartOptions>
 */
const buildChartOptions = (
  chartContainerEl: HTMLDivElement,
  height: number,
): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: 'black',
    attributionLogo: true,
  },
  width: chartContainerEl.clientWidth,
  height,
  grid: { horzLines: { visible: false }, vertLines: { visible: false } },
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



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toBars,
  buildChartOptions,
};
