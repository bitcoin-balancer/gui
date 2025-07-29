import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  IDataJoinService,
  IAppEssentials,
  ICompactAppEssentials,
} from '@/shared/backend/data-join/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Data Join Service Factory
 * Generates the object in charge of combining multiple data sources into one in order to reduce the
 * number of requests.
 * @returns IDataJoinService
 */
const dataJoinServiceFactory = (): IDataJoinService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves the App Essentials object for the currently authenticated user.
   * @returns Promise<IAppEssentials>
   */
  const getAppEssentials = (): Promise<IAppEssentials> =>
    APIService.request('GET', 'data-join/app-essentials', undefined, true);

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    getAppEssentials,
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const DataJoinService = dataJoinServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  DataJoinService,

  // types
  type IAppEssentials,
  type ICompactAppEssentials,
};
