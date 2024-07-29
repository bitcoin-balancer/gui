import { useState, useCallback, useEffect } from 'react';
import { IAPIRequestHook, IRequestFunction } from './types.ts';

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
        setError(undefined);
        if (!ignore) {
          setData(responseData);
        }
      } catch (e) {
        setError(e);
      } finally {
        setLoading(false);
      }
    };

    executeRequest();

    return () => { ignore = true; };
  }, [buildRequestFunction]);



  return { data, loading, error };
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default useAPIRequest;
