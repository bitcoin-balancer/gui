import { encodeError, decodeError } from 'error-message-utils';
import { toast } from '../../shadcn/components/ui/use-toast.ts';
import { IRecord } from '../../types.ts';
import { ISortDirection } from './types.ts';

/* ************************************************************************************************
 *                                         TOAST HELPERS                                          *
 ************************************************************************************************ */

/**
 * Builds the props and displays an error toast.
 * @param error
 * @param title?
 * @returns Toast
 */
const errorToast = (error: unknown, title: string = 'Error') => toast({
  variant: 'destructive',
  title,
  description: decodeError(error).message,
});





/* ************************************************************************************************
 *                                       SORTING UTILITIES                                        *
 ************************************************************************************************ */

/**
 * Orders two string values based on a sorting direction.
 * @param a
 * @param b
 * @param direction
 * @returns number
 */
const __sortStringValues = (a: string, b: string, direction: ISortDirection): number => {
  const _a = a.toLocaleLowerCase();
  const _b = b.toLocaleLowerCase();
  if (_a > _b) {
    return direction === 'asc' ? 1 : -1;
  }
  if (_b > _a) {
    return direction === 'asc' ? -1 : 1;
  }
  return 0;
};

/**
 * Orders two number values based on a sorting direction.
 * @param a
 * @param b
 * @param direction
 * @returns number
 */
const __sortNumberValues = (a: number, b: number, direction: ISortDirection): number => (
  direction === 'asc' ? a - b : b - a
);

/**
 * Sorts a list of primitive values based on their type and a sort direction.
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 */
const sortPrimitives = (
  direction: ISortDirection,
) => <T extends string | number>(a: T, b: T): number => {
  if (typeof a === 'string' && typeof b === 'string') {
    return __sortStringValues(a, b, direction);
  }
  if (typeof a === 'number' && typeof b === 'number') {
    return __sortNumberValues(a, b, direction);
  }
  throw new Error(encodeError(`Unable to sort list of primitive values as they can only be string | number and must not be mixed. Received: ${typeof a}, ${typeof b}`, 1));
};

/**
 * Sorts a list of record values by key based on their type and a sort direction.
 * @param key
 * @param direction
 * @returns <T extends string | number>(a: T, b: T): number
 */
const sortRecords = (
  key: string,
  direction: ISortDirection,
) => <T extends IRecord<unknown>>(a: T, b: T): number => {
  if (typeof a[key] === 'string' && typeof b[key] === 'string') {
    return __sortStringValues(a[key], b[key], direction);
  }
  if (typeof a[key] === 'number' && typeof b[key] === 'number') {
    return __sortNumberValues(a[key], b[key], direction);
  }
  throw new Error(encodeError(`Unable to sort list of record values as they can only be string | number and must not be mixed. Received: ${typeof a[key]}, ${typeof b[key]}`, 2));
};





/* ************************************************************************************************
 *                                          MISC HELPERS                                          *
 ************************************************************************************************ */

/**
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds
 * @returns Promise<void>
 */
const delay = (seconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, Math.round(seconds * 1000));
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // toast helpers
  errorToast,

  // sorting utilities
  sortPrimitives,
  sortRecords,

  // misc helpers
  delay,
};
