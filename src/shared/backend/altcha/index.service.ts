import { buildAPIURL } from '@/shared/backend/api/index.service.ts';
import { IAltchaService } from '@/shared/backend/altcha/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Altcha Service Factory
 * Generates the object in charge of providing utility functions to the widget.
 * @returns IAltchaService
 */
const altchaServiceFactory = (): IAltchaService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the URL used to fetch challenges
  const __CHALLENGE_URL = buildAPIURL('altcha');

  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get CHALLENGE_URL() {
      return __CHALLENGE_URL;
    },

    // actions
    // ...
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const AltchaService = altchaServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { AltchaService };
