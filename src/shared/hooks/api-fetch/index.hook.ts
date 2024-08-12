import { useState, useCallback, useMemo, useEffect } from 'react';
import { executeFetchFunc } from '@/shared/hooks/api-fetch/utils.ts';
import { IAPIFetchConfig, IAPIFetchHook, IAPIFetchFunction } from '@/shared/hooks/api-fetch/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Fetch Hook
 * Sends requests to the API and handles the responses. It takes a function and an optional list
 * of arguments that will be used to call the function with.
 */
const useAPIFetch: IAPIFetchHook = ({
  fetchFunc,
  refetchFrequency,
  queryLimit,
  appendNextRecords = true,
  sortFunc,
}: IAPIFetchConfig) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | undefined>(undefined);
  const [hasMore, setHasMore] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...


  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */


  const loadMore = async (func: IAPIFetchFunction, lastElementID: string): Promise<void> => {

  };




  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  useEffect(() => {
    let ignore = false;

    const fetchInitialData = async () => {
      try {
        const res = await executeFetchFunc(fetchFunc);
        console.log('useAPIFetch.fetchInitialData', res);
        if (!ignore) {
          setData(res);
          setLoading(false);
          setError(undefined);
          if (queryLimit) {
            setHasMore(Array.isArray(res) && res.length >= queryLimit);
          }
        }
      } catch (e) {
        setError(e);
      }
    };

    fetchInitialData();

    return () => { ignore = true; };
  }, [fetchFunc, queryLimit]);





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
