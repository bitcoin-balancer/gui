import {
  IChartApi,
  Time,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts';
import { IState, ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Chart Kind
 * The line and area charts are very similar as they share almost all properties.
 */
type IChartKind = 'area' | 'line';

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
  data: ISplitStateItem[];

  // the kind of chart that will be rendered
  kind?: IChartKind;

  // the current state of the module
  state?: IState;

  // the function that will be applied to each of the series items
  priceFormatterFunc?: IPriceFormatterFunc;
};

/**
 * Series Item
 * The object used by the charting library to render the area|line items.
 */
type ISeriesItem = {
  time: Time;
  value: number;
};

/**
 * Line Series
 * ...
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type HorzScaleItem = any;
type ILineSeriesAPI = ISeriesApi<SeriesType, HorzScaleItem>;

/**
 * Chart API Ref
 * ...
 */

type IChartAPIRef = {
  // the instance of the chart
  __api: IChartApi | undefined;

  // the instance of the series
  __series: ISeriesApi<'Line' | 'Area'> | undefined;

  // instantiates (only once) and returns the chart instance
  api: () => IChartApi;

  // instantiates (only once) and returns the series instance
  series: () => ILineSeriesAPI;

  // fires whenever new data comes into existance
  onSeriesChanges: (newData: ISplitStateItem[]) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IChartKind,
  IPriceFormatterFunc,
  IComponentProps,
  ISeriesItem,
  ILineSeriesAPI,
  IChartAPIRef,
};
