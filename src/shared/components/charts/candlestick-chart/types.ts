import {
  IChartApi,
  Time,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { IState } from '@/shared/backend/market-state/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

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

  // if enabled, it will format the prices displayed in the chart to integers like '$59,108'
  prettifyY?: boolean;
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
  IComponentProps,
  ICandlestickBar,
  ICandlestickSeriesAPI,
  IChartAPIRef,
};
