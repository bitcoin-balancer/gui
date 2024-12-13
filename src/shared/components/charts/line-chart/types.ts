import type {
  IChartApi,
  Time,
  ISeriesApi,
  SeriesType,
} from 'lightweight-charts';
import { IState, ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';
import { IPriceFormatterFunc, IPriceLineOptions } from '@/shared/components/charts/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Chart Kind
 * The line and area charts are very similar as they share almost all properties.
 */
type IChartKind = 'area' | 'line';

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the height of the chart
  height: number;

  // the records to render
  data: ISplitStateItem[];

  // the price lines that will be added to the chart
  priceLines?: IPriceLineOptions[];

  // the kind of chart that will be rendered
  kind?: IChartKind;

  // the current state of the module
  state?: IState;

  // the function that will be applied to each of the series items
  priceFormatterFunc?: IPriceFormatterFunc;

  // if enabled, it will display TradingView's logo on the chart
  showAttributionLogo?: boolean;

  // if enabled, it will hide the x axis
  hideTimeScale?: boolean;

  // hides the price scale that's generally displayed on the right of the chart (y axis)
  hideRightPriceScale?: boolean;

  // hides both crosshairs (vertical and horizontal)
  hideCrosshair?: boolean;

  // if enabled, the marker circle won't appear on hover
  hideCrosshairMarker?: boolean;

  // if enabled, the chart won't display the series price line
  hidePriceLine?: boolean;

  // if enabled, the user will be unable to drag the chart
  disableScrollHandler?: boolean;

  // if enabled, the user will be unable to scale the chart
  disableScaleHandler?: boolean;
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
  IComponentProps,
  ISeriesItem,
  ILineSeriesAPI,
  IChartAPIRef,
};
