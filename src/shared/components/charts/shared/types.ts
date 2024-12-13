import {
  UTCTimestamp,
  SeriesMarkerPosition,
  SeriesMarkerShape,
  CreatePriceLineOptions,
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

/**
 * Price Line
 * The object that will be used to render a line on the chart.
 */
type IPriceLineOptions = CreatePriceLineOptions;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPriceFormatterFunc,
  IMarker,
  IPriceLineOptions,
};
