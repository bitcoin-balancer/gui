import { IWindowService, IWindowState } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Service Factory
 * Generates the object in charge of keeping Balancer in sync with the market's candlesticks and
 * calculating its state.
 * @returns IWindowService
 */
const windowServiceFactory = (): IWindowService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





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
    // ...

    // actions
    someAction,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const WindowService = windowServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  WindowService,

  // types
  type IWindowState,
};
