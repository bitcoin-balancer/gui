import { IAPIFetchConfig, IAPIFetchFunction } from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds the configuration based on a partial object.
 * @param config
 * @returns IAPIFetchConfig
 */
const buildConfig = (config: Partial<IAPIFetchConfig>): IAPIFetchConfig => {
  if (
    typeof config.refetchFrequency === 'number'
    && typeof config.queryLimit === 'number'
    && config.sortFunc === undefined
  ) {
    throw new Error('If a list of records can be paginated and refetched, you must provide the sorting function.');
  }
  return {
    fetchFunc: config.fetchFunc!,
    refetchFrequency: config.refetchFrequency,
    queryLimit: config.queryLimit,
    sortFunc: config.sortFunc,
  };
};

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




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildConfig,
  executeFetchFunc,
};
