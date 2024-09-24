import {
  IChartApi,
  Time,
  ISeriesApi,
  SeriesType,
  UTCTimestamp,
  SeriesMarkerPosition,
  SeriesMarkerShape,
} from 'lightweight-charts';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { IState } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */


/**
 * Price Formatter Func
 * The function that will be applied to every item in the series.
 */
type IPriceFormatterFunc = (value: number) => string;

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the height of the chart
  height: number;

  // the records to render
  data: ICompactCandlestickRecords;

  // the current state of the module
  state?: IState;

  // the markers that will be rendered in the chart
  markers?: IMarker[];

  // the function that will be applied to each of the series items
  priceFormatterFunc?: IPriceFormatterFunc;
};

/**
 * Candlestick Bar
 * The object used by the charting library to render candlestick bars.
 */
type ICandlestickBar = {
  open: number;
  high: number;
  low: number;
  close: number;
  time: Time;
};

/**
 * Candlesick Series
 * ...
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HorzScaleItem = any;
type ICandlestickSeriesAPI = ISeriesApi<SeriesType, HorzScaleItem>;
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
 * Chart API Ref
 * ...
 */

type IChartAPIRef = {
  // the instance of the chart
  __api: IChartApi | undefined;

  // the instance of the series
  __series: ISeriesApi<'Candlestick'> | undefined;

  // instantiates (only once) and returns the chart instance
  api: () => IChartApi;

  // instantiates (only once) and returns the series instance
  series: () => ICandlestickSeriesAPI;

  // fires whenever new data comes into existance
  onSeriesChanges: (newData: ICompactCandlestickRecords) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPriceFormatterFunc,
  IComponentProps,
  ICandlestickBar,
  IMarker,
  ICandlestickSeriesAPI,
  IChartAPIRef,
};
