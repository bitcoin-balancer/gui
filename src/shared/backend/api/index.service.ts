import { decodeError } from 'error-message-utils';
import { delay } from 'web-utils-kit';
import {
  IRequestInput,
  IRequestMethod,
  IOptions,
  send,
} from 'fetch-request-browser';
import { IAPIResponse } from 'api-response-utils';
import { buildAPIURL, buildRequestOptions } from '@/shared/backend/api/utils.ts';
import { AccessJWTService } from '@/shared/backend/api/access-jwt.service.ts';
import { IAPIService } from '@/shared/backend/api/types.ts';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Service Factory
 * Generates the object in charge of brokering the communication with Balancer's API.
 * @returns IAPIService
 */
const apiServiceFactory = (): IAPIService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  /**
   * Sends a HTTP Request to the API and returns its response.
   * @param input
   * @param options
   * @param retryDelaySchedule
   * @returns Promise<IAPIResponse<T>>
   */
  const __sendRequest = async <T>(
    input: IRequestInput,
    options: Partial<IOptions>,
    retryDelaySchedule: number[] | undefined,
  ): Promise<IAPIResponse<T>> => {
    const reqResponse = await send<IAPIResponse<T>>(input, options, retryDelaySchedule);
    return reqResponse.data;
  };

  /**
   * Sends a HTTP Request to the API and retries if the Access JWT expired or if the API has not
   * finished the initialization process.
   * @param method
   * @param path
   * @param body?
   * @param requiresAuth?
   * @param otpToken?
   * @param retryDelaySchedule?
   * @returns Promise<T>
   * @throws
   * - if the request requires authentication and the Access JWT is undefined
   */
  const request = async <T>(
    method: IRequestMethod,
    path: string,
    body?: Record<string, unknown> | Array<unknown>,
    requiresAuth?: boolean,
    otpToken?: string,
    retryDelaySchedule: number[] = [3, 5, 7],
  ): Promise<T> => {
    // if it requires auth, the Access JWT must be set
    if (requiresAuth && typeof AccessJWTService.current !== 'string') {
      throw new Error('The request requires the user to be authenticated but the Access JWT has not been set.');
    }

    // send the request
    const res = await __sendRequest<T>(
      buildAPIURL(path),
      buildRequestOptions(method, body, AccessJWTService.current, otpToken),
      retryDelaySchedule,
    );

    // if the request was successful, return the data
    if (res.success) {
      return res.data;
    }

    // extract the code of the error
    const { code } = decodeError(res.error);

    // if the Access JWT expired, refresh it and try again
    if (code === 4252) {
      await AccessJWTService.accessJWTChanged(null);
      return request<T>(method, path, body, requiresAuth, otpToken, retryDelaySchedule);
    }

    // if the API is going through the initialization process, try again after a delay
    if (code === 6002) {
      await delay(30);
      return request<T>(method, path, body, requiresAuth, otpToken, retryDelaySchedule);
    }

    // if the request is not going to be retried, throw the error
    throw new Error(res.error);
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    request,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const APIService = apiServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // services
  AccessJWTService,
  APIService,

  // utilities
  buildAPIURL,
};
