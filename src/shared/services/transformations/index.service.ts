import { format } from 'date-fns';
import { IDateFormat } from '@/shared/services/transformations/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// values needed to format a file size value into a readable string
const FILE_SIZE_THRESHOLD: number = 1024;
const FILE_SIZE_UNITS: string[] = ['kB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];





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

/**
 * Formats a bytes value into a human readable format.
 * @param value
 * @param precision
 * @return string
 */
const formatFileSize = (value: unknown, precision: number = 1): string => {
  if (typeof value === 'number' && value > 0) {
    let bytes = value;

    // if the value is tiny, return it in bytes
    if (Math.abs(value) < FILE_SIZE_THRESHOLD) {
      return `${value} B`;
    }

    // iterate until the best unit of measure is found
    let u = -1;
    const r = 10 ** precision;
    do {
      bytes /= FILE_SIZE_THRESHOLD;
      u += 1;
    } while (
      Math.round(Math.abs(bytes) * r) / r >= FILE_SIZE_THRESHOLD && u < FILE_SIZE_UNITS.length - 1
    );

    // finally, return the value and its unit
    return `${bytes.toFixed(precision)} ${FILE_SIZE_UNITS[u]}`;
  }
  return '0 B';
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  formatBadgeCount,
  formatDate,
  formatFileSize,
};
