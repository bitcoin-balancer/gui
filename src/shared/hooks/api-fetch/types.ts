/* eslint-disable @typescript-eslint/no-explicit-any */
import { IHTMLElement, IRecord } from '@/shared/types.ts';

/* ************************************************************************************************
 *                                              HOOK                                              *
 ************************************************************************************************ */

/**
 * Sort Func
 * The sort function used to keep records in order when refetching or loading more records.
 */
type ISortFunc =
  (<T extends string | number>(a: T, b: T) => number)
  | (<T extends IRecord<unknown>>(a: T, b: T) => number);

/**
 * Fetch Function Reference
 * The hook requires function references to be passed as args so they can be invoked accordingly.
 */
type IAPIFetchFunctionReference = (...args: any[]) => Promise<any>;

/**
 * Fetch Function
 * Object containing the reference to the request function and its args (if any).
 */
type IAPIFetchFunction = {
  func: IAPIFetchFunctionReference;
  args?: any[];
};

/**
 * Configuration
 * The configuration object that will instruct how to load and paginate data.
 */
type IAPIFetchConfig = {
  // the function that will be invoked to load the initial data
  fetchFunc: IAPIFetchFunction;

  // the data will be refetched every refetchFrequency seconds
  refetchFrequency?: number;

  // the maximum number of records that will be retrieved at a time
  queryLimit?: number;

  // appends records to the list when loaded. If disabled, it will prepend the records instead
  appendNextRecords?: boolean;

  // the sort func that will be applied to records when the data is refetched and has been paginated
  sortFunc?: ISortFunc;
};

/**
 * API Fetch Hook
 * The hook in charge of handling the retrieval, loading and error states
 */
type IAPIFetchHook = <T>(config: IAPIFetchConfig) => {
  data: T | T[];
  // setData: (state: T) => void;
  loading: boolean;
  error: Error | undefined;
  hasMore: boolean;
  loadMore: (
    func: IAPIFetchFunction,
    parentEl?: IHTMLElement,
    lastElementID?: string,
  ) => Promise<void>;
  loadingMore: boolean;
};





/* ************************************************************************************************
 *                                            REDUCER                                             *
 ************************************************************************************************ */

/**
 * Action Type
 * The actions that can take place within the hook.
 */
type IActionType = 'INITIAL_DATA' | 'MORE_DATA' | 'REFETCHED_DATA';
type IAction<T> = {
  type: IActionType;
  data: T | T[];
} & (
  | {
    type: 'INITIAL_DATA';
  }
  | {
    type: 'MORE_DATA';
    data: T[];
    appendNextRecords: boolean | undefined;
    sortFunc: ISortFunc | undefined;
  } | {
    type: 'REFETCHED_DATA';
    sortFunc: ISortFunc | undefined;
  }
);




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // hook
  IAPIFetchFunction,
  IAPIFetchConfig,
  IAPIFetchHook,

  // reducer
  IActionType,
  IAction,
};
