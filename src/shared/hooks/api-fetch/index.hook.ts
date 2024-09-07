/* eslint-disable no-console */
import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from 'react';
import { flushSync } from 'react-dom';
import { IHTMLElement } from '@/shared/types.ts';
import { errorToast, scrollChildIntoView } from '@/shared/services/utils/index.service.ts';
import { executeFetchFunc, hasMoreRecords, onMoreData } from '@/shared/hooks/api-fetch/utils.ts';
import { IAPIFetchConfig, IAPIFetchHook, IAPIFetchFunction } from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// if enabled, it will print logs on the console
const DEBUG = true;





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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<T | any>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [refetching, setRefetching] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Refetches the initial data and sets the state a new.
   * @returns Promise<void>
   */
  const refetchData = useCallback(
    async (): Promise<void> => {
      try {
        setRefetching(true);
        const res = await executeFetchFunc<T>(fetchFunc);
        if (DEBUG) console.log('useAPIFetch.refetchData', res);
        setData(res);
      } catch (e) {
        errorToast(e, 'Refetch Error');
      } finally {
        setRefetching(false);
      }
    },
    [fetchFunc],
  );

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
            setData(onMoreData(data, res, sortFunc, appendNextRecords));
          });
          scrollChildIntoView(parentEl, lastElementID!);
        } else {
          setData(onMoreData(data, res, sortFunc, appendNextRecords));
        }

        setHasMore(hasMoreRecords(res, queryLimit));
      } catch (e) {
        errorToast(e, 'Fetch Error');
      } finally {
        setLoadingMore(false);
      }
    },
    [data, queryLimit, appendNextRecords, sortFunc],
  );




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
    if (!refetchInterval.current && typeof refetchFrequency === 'number') {
      refetchInterval.current = setInterval(() => {
        refetchData();
      }, refetchFrequency * 1000);
    }
    return () => {
      clearInterval(refetchInterval.current);
      refetchInterval.current = undefined;
    };
  }, [refetchFrequency, refetchData]);





  /* **********************************************************************************************
   *                                         HOOK EXPORTS                                         *
   ********************************************************************************************** */
  return {
    data,
    setData,
    loading,
    error,
    refetchData,
    refetching,
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
