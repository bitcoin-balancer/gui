import { IRequestMethod } from 'fetch-request-browser';
import { IRecord } from '../../types.ts';


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

  // access JWT management
  accessJWTChanged: (newAccessJWT: string | undefined) => Promise<void>;

  // actions
  request: (
    method: IRequestMethod,
    path: string,
    body?: IRecord<unknown>,
    requiresAuth?: boolean,
    otpToken?: string,
    retryDelaySchedule?: number[],
  ) => Promise<unknown>
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
