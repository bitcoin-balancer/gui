/* eslint-disable @typescript-eslint/no-explicit-any */


/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the function that will be invoked by the hook
type IRequestFunction = (...args: any[]) => Promise<any>;

// the hook in charge of handling the retrieval, loading and error states
type IAPIRequestHook = <T>(
  requestFunction: IRequestFunction,
  args?: any[]
) => {
  data: T,
  setData: (state: T) => void,
  loading: boolean,
  error: unknown | undefined,
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IRequestFunction,
  IAPIRequestHook,
};
