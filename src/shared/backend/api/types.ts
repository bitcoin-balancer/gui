import { IRequestMethod } from 'fetch-request-browser';


/* ************************************************************************************************
 *                                           SERVICES                                             *
 ************************************************************************************************ */

/**
 * API Service
 * Object in charge of brokering the communication with Balancer's API.
 */
type IAPIService = {
  // properties
  // ...

  // actions
  request: <T>(
    method: IRequestMethod,
    path: string,
    body?: Record<string, unknown>,
    requiresAuth?: boolean,
    otpToken?: string,
    retryDelaySchedule?: number[],
  ) => Promise<T>;
};

/**
 * Access JWT Service
 * Object in charge of managing the Authentication's Access JWT for API Requests and the
 * global state.
 */
type IAccessJWTService = {
  // properties
  current: string | undefined;

  // access JWT management
  accessJWTChanged: (newAccessJWT: string | null | undefined) => Promise<void>;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // services
  IAPIService,
  IAccessJWTService,

  // types
  // ...
};
