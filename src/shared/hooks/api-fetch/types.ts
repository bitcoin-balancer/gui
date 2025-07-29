import { IHTMLElement } from '@/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Sort Fn
 * The sort function used to keep records in order when loading more records.
 */
type ISortFn =
  | (<T extends string | number>(a: T, b: T) => number)
  | (<T extends Record<string, unknown>>(a: T, b: T) => number);

/**
 * Configuration
 * The configuration object that will instruct how to load and paginate data.
 */
type IAPIFetchConfig<T> = {
  // the function that will be invoked to load the initial data
  fetchFn: () => Promise<T>;

  // the data will be refetched every refetchFrequency seconds
  refetchFrequency?: number;

  // the maximum number of records that will be retrieved at a time
  queryLimit?: number;

  // appends records to the list when loaded. If disabled, it will prepend the records instead
  appendNextRecords?: boolean;

  // the sort func that will be applied when loading more records
  sortFn?: ISortFn;
};

/**
 * API Fetch Hook
 * The hook in charge of handling the retrieval, loading and error states
 */
type IAPIFetchHook = <T>(config: IAPIFetchConfig<T>) => {
  data: T;
  setData: (state: T) => void;
  loading: boolean;
  error: Error | undefined;
  refetchData: () => Promise<void>;
  refetching: boolean;
  hasMore: boolean;
  loadMore: (
    fn: () => Promise<T>,
    parentEl?: IHTMLElement,
    lastElementID?: string,
  ) => Promise<void>;
  loadingMore: boolean;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { ISortFn, IAPIFetchConfig, IAPIFetchHook };
