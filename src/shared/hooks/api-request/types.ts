

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

type IRequestFunction = (...args: unknown[]) => Promise<unknown>;

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
