/* eslint-disable @typescript-eslint/no-explicit-any */
import { ISortFn } from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Checks if a data source has more records that can be retrieved.
 * @param data
 * @param queryLimit
 * @returns boolean
 */
const hasMoreRecords = (data: unknown, queryLimit: number | undefined): boolean =>
  typeof queryLimit === 'number' && Array.isArray(data) && data.length >= queryLimit;

/**
 * Fires when the loadMore function is invoked. It merges the current data with the new data that
 * was just retrieved from the API.
 * @param records
 * @param nextRecords
 * @param sortFn
 * @param appendNextRecords
 * @returns T
 */
const onMoreData = <T>(
  records: T,
  nextRecords: T,
  sortFn: ISortFn | undefined,
  appendNextRecords: boolean | undefined,
): T => {
  // prioritize the sortFn if it was provided
  if (typeof sortFn === 'function') {
    return [...(records as any[]), nextRecords].sort(sortFn) as T;
  }

  // otherwise, append or prepend the data
  return appendNextRecords
    ? ([...(records as any[]), ...(nextRecords as any[])] as T)
    : ([...(nextRecords as any[]), ...(records as any[])] as T);
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { hasMoreRecords, onMoreData };
