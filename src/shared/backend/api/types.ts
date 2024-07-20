

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * API Service
 * Object in charge of brokering the communication with Balancer's API.
 */
type IAPIService = {
  // properties
  // ...

  // helpers
  buildURL: (resourcePath: string) => string;

  // actions
  // ...
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IAPIService,

  // types
  // ...
};