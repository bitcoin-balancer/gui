import { IVersionService, IVersion } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Some Service Factory
 * Generates the object in charge of keeping track of the running and latest distributed versions.
 * @returns IVersionService
 */
const versionServiceFactory = (): IVersionService => ({});





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const VersionService = versionServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  VersionService,

  // types
  type IVersion,
};
