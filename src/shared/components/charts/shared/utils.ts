import { SeriesMarkerPosition, SeriesMarkerShape, UTCTimestamp } from 'lightweight-charts';
import { IMarker, IPriceLineOptions } from '@/shared/components/charts/shared/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * In order for the charts to make use of the local time instead of UTC, the timestamps need to be
 * processed as lightweight-charts doesn't support timezones.
 * https://tradingview.github.io/lightweight-charts/docs/time-zones#date-solution
 * @param originalTime
 * @returns UTCTimestamp
 */
const toLocalTime = (originalTime: number): UTCTimestamp => {
  const d = new Date(originalTime);
  return Date.UTC(
    d.getFullYear(),
    d.getMonth(),
    d.getDate(),
    d.getHours(),
    d.getMinutes(),
    d.getSeconds(),
    d.getMilliseconds(),
  ) / 1000 as UTCTimestamp;
};

/**
 * Builds a marker's object and processes the time so it is properly displayed.
 * @param time
 * @param position
 * @param color
 * @param shape
 * @param text
 * @returns IMarker
 */
const buildChartMarker = (
  time: number,
  position: SeriesMarkerPosition,
  color: string,
  shape: SeriesMarkerShape,
  text: string,
): IMarker => ({
  time: toLocalTime(time),
  position,
  color,
  shape,
  text,
});

/**
 * Builds a price line options object based on a partial one.
 * @param options
 * @returns IPriceLineOptions
 */
const buildChartPriceLine = (options: IPriceLineOptions): IPriceLineOptions => ({
  ...options,
  lineWidth: options.lineWidth ?? 2,
  lineStyle: options.lineStyle ?? 2,
  axisLabelVisible: options.axisLabelVisible ?? true,
});

/**
 * Compares two price line objects and returns true if they are equal.
 * @param a
 * @param b
 * @returns boolean
 */
const areLinesEqual = (a: IPriceLineOptions, b: IPriceLineOptions): boolean => (
  a.id === b.id
  && a.price === b.price
  && a.color === b.color
  && a.title === b.title
);




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toLocalTime,
  buildChartMarker,
  buildChartPriceLine,
  areLinesEqual,
};
