import { ENVIRONMENT } from '@/environment/environment.ts';
import { IVersionService, IVersion, IAvailableUpdates } from '@/shared/backend/version/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Some Service Factory
 * Generates the object in charge of keeping track of the running and latest distributed versions.
 * @returns IVersionService
 */
const versionServiceFactory = (): IVersionService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                            HELPERS                                           *
   ********************************************************************************************** */

  /**
   * Analysis the running and the latest distributed versions to determine if any of the services
   * can be updated.
   * @param version
   * @returns IAvailableUpdates
   */
  const getAvailableUpdates = (version: IVersion): IAvailableUpdates => {
    if (
      ENVIRONMENT.version !== version.gui.latest.version
      && version.api.running !== version.api.latest.version
    ) {
      return 'BOTH';
    }
    if (ENVIRONMENT.version !== version.gui.latest.version) {
      return 'GUI';
    }
    if (version.api.running !== version.api.latest.version) {
      return 'API';
    }
    return null;
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    getAvailableUpdates,
  });
};





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
