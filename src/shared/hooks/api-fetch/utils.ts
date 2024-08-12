import { IAPIFetchFunction } from '@/shared/hooks/api-fetch/types.ts';

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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  executeFetchFunc,
  hasMoreRecords,
};
