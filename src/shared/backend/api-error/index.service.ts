import { APIService } from '@/shared/backend/api/index.service.ts';
import { IAPIErrorService, IAPIError } from '@/shared/backend/api-error/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Service Factory
 * Generates the object in charge of managing the storage and retrieval of errors thrown within
 * the API.
 * @returns IAPIErrorService
 */
const apiErrorServiceFactory = (): IAPIErrorService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                           ACTIONS                                            *
   ********************************************************************************************** */

  /**
   * Retrieves a series of API Errors. If the startAtID is provided, it will start at that point
   * exclusively.
   * @param limit
   * @param startAtID?
   * @returns Promise<IAPIError[]>
   * @throws
   * - 1000: if the startAtID was provided and is not a valid identifier
   * - 1001: if the query limit is larger than the limit
   */
  const list = (limit: number, startAtID?: number): Promise<IAPIError[]> => {
    let urlPath: string = `api-error?limit=${limit}`;
    if (typeof startAtID === 'number') {
      urlPath += `&startAtID=${startAtID}`;
    }
    return APIService.request('GET', urlPath, undefined, true);
  };

  /**
   * Deletes all the API Errors from the Database.
   * @param otpToken
   * @returns Promise<void>
   */
  const deleteAll = (otpToken: string): Promise<void> =>
    APIService.request('DELETE', 'api-error', undefined, true, otpToken);

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    list,
    deleteAll,
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const APIErrorService = apiErrorServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  APIErrorService,

  // types
  type IAPIError,
};
