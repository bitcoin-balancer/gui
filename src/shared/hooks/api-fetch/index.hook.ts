import { useReducer, useState, useEffect } from 'react';
import { errorToast, scrollChildIntoView } from '@/shared/services/utils/index.service.ts';
import { IHTMLElement } from '@/shared/types.ts';
import { executeFetchFunc, hasMoreRecords } from '@/shared/hooks/api-fetch/utils.ts';
import { reducer } from '@/shared/hooks/api-fetch/reducer.ts';
import {
  IAPIFetchConfig,
  IAPIFetchHook,
  IAPIFetchFunction,
  IAction,
} from '@/shared/hooks/api-fetch/types.ts';

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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, dispatch] = <[T | any, (action: IAction<T>) => void]>useReducer(reducer, undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...
  console.log('In useAPIFetch');





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
  const loadMore = async (
    func: IAPIFetchFunction,
    parentEl?: IHTMLElement,
    lastElementID?: string,
  ): Promise<void> => {
    try {
      setLoadingMore(true);
      const res = await executeFetchFunc<T>(func);
      dispatch({
        type: 'MORE_DATA',
        data: res,
        appendNextRecords,
        sortFunc,
      });
      if (parentEl) {
        scrollChildIntoView(parentEl, lastElementID!);
      }

      setHasMore(hasMoreRecords(res, queryLimit));
    } catch (e) {
      errorToast(e, 'Refetch Error');
    } finally {
      setLoadingMore(false);
    }
  };





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
        console.log('useAPIFetch.fetchInitialData', res);
        if (!ignore) {
          dispatch({ type: 'INITIAL_DATA', data: res });
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
  }, [fetchFunc, queryLimit, dispatch]);





  /* **********************************************************************************************
   *                                         HOOK EXPORTS                                         *
   ********************************************************************************************** */
  return {
    data,
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
