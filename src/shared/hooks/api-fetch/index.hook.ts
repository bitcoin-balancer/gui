/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { flushSync } from 'react-dom';
import { IHTMLElement } from '@/shared/types.ts';
import { errorToast, scrollChildIntoView } from '@/shared/services/utils/index.service.ts';
import { executeFetchFunc, hasMoreRecords } from '@/shared/hooks/api-fetch/utils.ts';
import {
  IAPIFetchConfig,
  IAPIFetchHook,
  IAPIFetchFunction,
  ISortFunc,
} from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// if enabled, it will print logs on the console
const DEBUG = true;





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Handles the update of the state when more records are loaded.
 * @param records
 * @param nextRecords
 * @param sortFunc
 * @param appendNextRecords
 * @returns T
 */
const __onMoreData = <T>(
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
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Fetch Hook
 * Sends requests to the API and handles the responses. It takes a function and an optional list
 * of arguments that will be used to call the function with.
 */
const useAPIFetch: IAPIFetchHook = <T>({
  fetchFunc,
  refetchFrequency,
  queryLimit,
  appendNextRecords = true,
  sortFunc,
}: IAPIFetchConfig) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const refetchInterval = useRef<NodeJS.Timeout | undefined>(undefined);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [data, setData] = useState<T | any>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Fetches the initial data and sets the state.
   */
  useEffect(() => {
    let ignore = false;

    const fetchInitialData = async () => {
      try {
        const res = await executeFetchFunc<T>(fetchFunc);
        if (DEBUG) console.log('useAPIFetch.fetchInitialData', res);
        if (!ignore) {
          setData(res);
          setLoading(false);
          setError(undefined);
          setHasMore(hasMoreRecords(res, queryLimit));
        }
      } catch (e) {
        setError(e as Error);
      }
    };

    fetchInitialData();

    return () => { ignore = true; };
  }, [fetchFunc, queryLimit]);

  /**
   * Refetches the data every refetchFrequency seconds.
   */
  useEffect(() => {
    const interval = refetchInterval.current;
    if (!interval && typeof refetchFrequency === 'number') {
      refetchInterval.current = setInterval(async () => {
        try {
          const res = await executeFetchFunc<T>(fetchFunc);
          if (DEBUG) console.log('useAPIFetch.refetchInterval', res);
          setData(res);
        } catch (e) {
          errorToast(e, 'Refetch Error');
        }
      }, refetchFrequency * 1000);
    }
    return () => clearInterval(interval);
  }, [refetchFrequency, fetchFunc, sortFunc]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Loads the next set of records and updates the state.
   * @param func
   * @param parentEl
   * @param lastElementID?
   * @returns Promise<void>
   */
  const loadMore = useCallback(
    async (
      func: IAPIFetchFunction,
      parentEl?: IHTMLElement,
      lastElementID?: string,
    ): Promise<void> => {
      try {
        setLoadingMore(true);
        const res = await executeFetchFunc<T>(func);
        if (DEBUG) console.log('useAPIFetch.loadMore', res);

        // apply the changes based on the config
        if (parentEl) {
          flushSync(() => {
            setData(__onMoreData(data, res, sortFunc, appendNextRecords));
          });
          scrollChildIntoView(parentEl, lastElementID!);
        } else {
          setData(__onMoreData(data, res, sortFunc, appendNextRecords));
        }

        setHasMore(hasMoreRecords(res, queryLimit));
      } catch (e) {
        errorToast(e);
      } finally {
        setLoadingMore(false);
      }
    },
    [data, queryLimit, appendNextRecords, sortFunc],
  );





  /* **********************************************************************************************
   *                                         HOOK EXPORTS                                         *
   ********************************************************************************************** */
  return {
    data,
    setData,
    loading,
    error,
    hasMore,
    loadMore,
    loadingMore,
  };
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useAPIFetch,
};
