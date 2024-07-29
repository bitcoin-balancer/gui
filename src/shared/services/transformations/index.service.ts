import { format } from 'date-fns';
import { IDateFormat } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Formats the number that will be inserted in a badge so it doesn't take too much space.
 * @param count
 * @param maxValue?
 * @returns string | undefined
 */
const formatBadgeCount = (count: number, maxValue: number = 9): string | undefined => {
  if (count === 0) {
    return undefined;
  }
  if (count >= maxValue) {
    return `${maxValue}+`;
  }
  return String(count);
};

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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  formatBadgeCount,
  formatDate,
};
