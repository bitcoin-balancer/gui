import { ENVIRONMENT } from '@/environment/environment.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import {
  IVersionService,
  IVersion,
  IServiceVersion,
  IAvailableUpdates,
} from '@/shared/backend/version/types.ts';

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
      ENVIRONMENT.version !== version.gui.latest.version &&
      version.api.running !== version.api.latest.version
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

  /**
   * Builds the text that will be used to show the user information regarding the running version.
   * @param service
   * @returns string
   */
  const buildLastCommitText = (service: IServiceVersion): string =>
    `v${service.version} · ${service.sha.slice(0, 7)} · ${formatDate(service.eventTime, 'date-short')}`;

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    getAvailableUpdates,
    buildLastCommitText,
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
  type IServiceVersion,
  type IAvailableUpdates,
};
