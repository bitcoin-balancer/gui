import { IClipboardService } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Clipboard Service Factory
 * Generates the object in charge of interacting with the Clipboard API.
 * @returns IClipboardService
 */
const clipboardServiceFactory = (): IClipboardService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // indicates if the Clipboard API is supported by the user's browser
  const __isSupported: boolean = Boolean(window)
    && Boolean(window.navigator)
    && Boolean(window.navigator.clipboard)
    && typeof window.navigator.clipboard.readText === 'function'
    && typeof window.navigator.clipboard.writeText === 'function';





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  const someAction = () => {
    // ...
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get isSupported() {
      return __isSupported;
    },

    // actions
    someAction,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ClipboardService = clipboardServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ClipboardService,
};
