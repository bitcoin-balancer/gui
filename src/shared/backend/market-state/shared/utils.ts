import { adjustByPercentage } from 'bignumber-utils';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { ISplitStateItem, ISplitStates } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// a mock date to be able to build the split state items
const CURRENT_TIME = 1724877858112;

// the number of milliseconds in 1 hour
const ONE_HOUR_MS = 60 * (60 * 1000);

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Converts a compact candlestick records object into a list of split state items.
 * @param records
 * @returns ISplitStateItem[]
 */
const toSplitStateItems = (records: ICompactCandlestickRecords): ISplitStateItem[] =>
  records.id.reduce(
    (prev, current, idx) => [...prev, { x: current, y: records.close[idx] }],
    [] as ISplitStateItem[],
  );

/**
 * Calculates the estimated price for a split state item based on the percentage change it has
 * experienced.
 * @param val
 * @param change
 * @returns number
 */
const __calculateEstimatedSplitValue = (val: number, change: number): number =>
  adjustByPercentage(val, -change, { decimalPlaces: 8 });

/**
 * Turns a split states object into a series of split state items (estimated dates and prices).
 * @param states
 * @returns ISplitStateItem[]
 */
const toLineSeries = (states: ISplitStates): ISplitStateItem[] => [
  { x: CURRENT_TIME - ONE_HOUR_MS * 8, y: __calculateEstimatedSplitValue(1, states.s100.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 7, y: __calculateEstimatedSplitValue(1, states.s75.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 6, y: __calculateEstimatedSplitValue(1, states.s50.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 5, y: __calculateEstimatedSplitValue(1, states.s25.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 4, y: __calculateEstimatedSplitValue(1, states.s15.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 3, y: __calculateEstimatedSplitValue(1, states.s10.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 2, y: __calculateEstimatedSplitValue(1, states.s5.change) },
  { x: CURRENT_TIME - ONE_HOUR_MS * 1, y: __calculateEstimatedSplitValue(1, states.s2.change) },
  { x: CURRENT_TIME, y: 1 },
];

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { toSplitStateItems, toLineSeries };
