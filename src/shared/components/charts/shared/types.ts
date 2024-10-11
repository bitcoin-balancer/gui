import {
  UTCTimestamp,
  SeriesMarkerPosition,
  SeriesMarkerShape,
} from 'lightweight-charts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Price Formatter Func
 * The function that will be applied to every item in the series.
 */
type IPriceFormatterFunc = (value: number) => string;

/**
 * Marker
 * A note that is rendered inside of the chart.
 */
type IMarker = {
  time: UTCTimestamp;
  position: SeriesMarkerPosition;
  shape: SeriesMarkerShape;
  color: string;
  id?: string;
  text?: string;
  size?: number;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPriceFormatterFunc,
  IMarker,
};
