import { Time } from 'lightweight-charts';
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
};

/**
 * Candlestick Bar
 * The object used by the charting library to render candlestick bars.
 */
type ICandlestickBar = {
  open: number,
  high: number,
  low: number,
  close: number,
  time: Time,
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
  ICandlestickBar,
};
