import { useState, useCallback, useEffect } from 'react';
import { IAPIRequestHook, IRequestFunction } from '@/shared/hooks/api-request/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Request Hook
 * Sends requests to the API and handles the responses. It takes a function and an optional list
 * of arguments that will be used to call the function with.
 */
const useAPIRequest: IAPIRequestHook = (requestFunction: IRequestFunction, args?: unknown[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [data, setData] = useState<any>(undefined);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<unknown | undefined>(undefined);



  const buildRequestFunction = useCallback(
    () => (args === undefined ? requestFunction() : requestFunction(...args)),
    [requestFunction, args],
  );



  useEffect(() => {
    let ignore = false;

    const executeRequest = async () => {
      try {
        const responseData = await buildRequestFunction();
        console.log('useAPIRequest', responseData);
        if (!ignore) {
          setData(responseData);
          setLoading(false);
          setError(undefined);
        }
      } catch (e) {
        setError(e);
      }
    };

    executeRequest();

    return () => { ignore = true; };
  }, [buildRequestFunction]);



  return {
    data,
    setData,
    loading,
    error,
  };
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useAPIRequest,
};
