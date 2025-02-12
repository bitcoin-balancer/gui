/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAPIFetchFunction, ISortFunc } from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Executes a given fetch function asynchronously.
 * @param fetchFunction
 * @returns Promise<T>
 */
const executeFetchFunc = <T>(fetchFunction: IAPIFetchFunction): Promise<T> => {
  if (fetchFunction.args) {
    return fetchFunction.func(...fetchFunction.args);
  }
  return fetchFunction.func();
};

/**
 * Checks if a data source has more records that can be retrieved.
 * @param data
 * @param queryLimit
 * @returns boolean
 */
const hasMoreRecords = (data: unknown, queryLimit: number | undefined): boolean => (
  typeof queryLimit === 'number' && Array.isArray(data) && data.length >= queryLimit
);

/**
 * Fires when the loadMore function is invoked. It merges the current data with the new data that
 * was just retrieved from the API.
 * @param records
 * @param nextRecords
 * @param sortFunc
 * @param appendNextRecords
 * @returns T
 */
const onMoreData = <T>(
  records: T,
  nextRecords: T,
  sortFunc: ISortFunc | undefined,
  appendNextRecords: boolean | undefined,
): T => {
  // prioritize the sortFunc if it was provided
  if (typeof sortFunc === 'function') {
    return [...records as any[], nextRecords].sort(sortFunc) as T;
  }

  // otherwise, append or prepend the data
  return appendNextRecords
    ? [...records as any[], ...nextRecords as any[]] as T
    : [...nextRecords as any[], ...records as any[]] as T;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  executeFetchFunc,
  hasMoreRecords,
  onMoreData,
};
