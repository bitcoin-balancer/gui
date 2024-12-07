import { format } from 'date-fns';
import { processValue, prettifyValue } from 'bignumber-utils';
import {
  ISplitPercentageChanges,
  ISplitStateID,
  ISplitStates,
} from '@/shared/backend/market-state/shared/types.ts';
import { IDateFormat } from '@/shared/services/transformers/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Formats a timestamp into a human readable datetime.
 * @param date
 * @param dateFormat
 * @returns string
 */
const formatDate = (date: string | number | Date, dateFormat: IDateFormat): string => {
  switch (dateFormat) {
    case 'date-short':
      return format(date, 'dd/LL/yyyy');
    case 'date-medium':
      return format(date, 'PPP');
    case 'date-long':
      return format(date, 'PPPP');
    case 'time-short':
      return format(date, 'p');
    case 'time-medium':
      return format(date, 'pp');
    case 'datetime-short':
      return format(date, 'dd/LL/yyyy, pp');
    case 'datetime-medium':
      return format(date, 'PPpp');
    case 'datetime-long':
      return format(date, 'PPPPpp');
    default:
      throw new Error(`The provided date format '${dateFormat}' is not supported.`);
  }
};

/**
 * Turns a percentage change value into a readable string.
 * @param value
 * @param decimalPlaces?
 * @returns string
 */
const formatPercentageChange = (value: number, decimalPlaces: number = 2): string => (
  `${value > 0 ? '+' : ''}${processValue(value, { decimalPlaces })}%`
);

/**
 * Prettifies a dollar amount and returns the string representation.
 * @param value
 * @param decimalPlaces?
 * @returns string
 */
const formatDollarAmount = (value: number, decimalPlaces: number = 2, prefix: string = '$'): string => (
  prettifyValue(value, { processing: { decimalPlaces }, format: { prefix } })
);

/**
 * Prettifies a bitcoin amount and returns the string representation.
 * @param value
 * @param decimalPlaces?
 * @returns string
 */
const formatBitcoinAmount = (value: number, decimalPlaces: number = 8): string => (
  prettifyValue(value, { processing: { decimalPlaces }, format: { prefix: '₿' } })
);

/**
 * Prettifies a PNL value and returns the string representation.
 * @param pnl
 * @param decimalPlaces
 * @returns string
 */
const formatPNL = (pnl: number, decimalPlaces?: number): string => {
  const value = formatDollarAmount(pnl, decimalPlaces);
  return pnl > 0 ? `+${value}` : value;
};

/**
 * Prettifies the values in a split states object and returns them.
 * @param splitStates
 * @returns ISplitPercentageChanges
 */
const formatSplitStateChanges = (splitStates: ISplitStates): ISplitPercentageChanges => (
  Object.keys(splitStates).reduce(
    (prev, current) => ({
      ...prev,
      [current]: formatPercentageChange(splitStates[current as ISplitStateID].change, 1),
    }),
    {} as ISplitPercentageChanges,
  )
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  formatDate,
  formatPercentageChange,
  formatDollarAmount,
  formatBitcoinAmount,
  formatPNL,
  formatSplitStateChanges,
};
