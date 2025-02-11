import { BrowserCache } from 'browser-cache-async';
import { APIService } from '@/shared/backend/api/index.service.ts';
import { IDatabaseService, IDatabaseSummary } from '@/shared/backend/database/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Database Service Factory
 * Object in charge of managing the initialization and teardown of the PostgreSQL connection. It
 * also manages the instantiation of the Pool and exposes it so other modules can read it directly.
 * @returns IDatabaseService
 */
const databaseServiceFactory = (): IDatabaseService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the instance of the state's cache
  const __dbSummaryCache = new BrowserCache<IDatabaseSummary>('db-summary');





  /* **********************************************************************************************
   *                                       DATABASE SUMMARY                                       *
   ********************************************************************************************** */

  /**
   * Retrieves the essential database info to get an idea of how things are going from the GUI.
   * @returns Promise<IDatabaseSummary>
   */
  const getDatabaseSummary = (): Promise<IDatabaseSummary> => __dbSummaryCache.run({
    query: () => APIService.request(
      'GET',
      'database/summary',
      undefined,
      true,
    ),
    revalidate: '1 hour',
  });





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    getDatabaseSummary,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const DatabaseService = databaseServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  DatabaseService,

  // types
  type IDatabaseService,
  type IDatabaseSummary,
};
