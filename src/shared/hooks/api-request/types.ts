

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the function that will be invoked by the hook
type IRequestFunction = (...args: unknown[]) => Promise<unknown>;

// the hook in charge of handling the retrieval, loading and error states
type IAPIRequestHook = <T>(
  requestFunction: IRequestFunction,
  args?: unknown[]
) => { data: T, loading: boolean, error: unknown | undefined };




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IRequestFunction,
  IAPIRequestHook,
};