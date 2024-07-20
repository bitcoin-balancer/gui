import { IMediaQueryService, IBreakpoint } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Media Query Service Factory
 * Generates the object in charge of providing utility functions to manage responsive media queries
 * easily.
 * @returns IMediaQueryService
 */
const mediaQueryServiceFactory = (): IMediaQueryService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  /**
   * Retrieves the current media query breakpoint based on the client's screen width.
   * @param screenWidth
   * @returns IBreakpoint
   */
  const getBreakpoint = (screenWidth: number): IBreakpoint => {
    if (screenWidth >= 1536) {
      return '2xl';
    }
    if (screenWidth >= 1280) {
      return 'xl';
    }
    if (screenWidth >= 1024) {
      return 'lg';
    }
    if (screenWidth >= 768) {
      return 'md';
    }
    if (screenWidth >= 640) {
      return 'sm';
    }
    return 'xs';
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    getBreakpoint,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const MediaQueryService = mediaQueryServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IBreakpoint,

  // service
  MediaQueryService,
};
