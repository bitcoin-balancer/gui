import { decodeError } from 'error-message-utils';
import {
  IRequestInput,
  IRequestMethod,
  IOptions,
  sendPOST,
  send,
} from 'fetch-request-browser';
import { IAPIResponse } from 'api-response-utils';
import { IRecord } from '../../types.ts';
import { delay } from '../../services/utils/index.service.ts';
import { ENVIRONMENT } from '../../../environment/environment.ts';
import { jwtValid } from '../validations/index.service.ts';
import { useBoundStore } from '../../store/index.store.ts';
import { IAPIService } from './types.ts';


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

  // the number of minutes an access token is valid for
  const __ACCESS_JWT_DURATION = 14;

  // the interval in charge of refreshing the JWT before it expires
  let __accessJWTRefreshInterval: NodeJS.Timeout | undefined;

  // the current Access JWT
  let __accessJWT: string | undefined;





  /* **********************************************************************************************
   *                                            HELPERS                                           *
   ********************************************************************************************** */

  /**
   * Builds the URL that will be used to interact with an API's Resource.
   * @param resourcePath
   * @returns string
   */
  const buildURL = (resourcePath: string): string => `${ENVIRONMENT.apiURL}/${resourcePath}`;





  /* **********************************************************************************************
   *                                     ACCESS JWT MANAGEMENT                                    *
   ********************************************************************************************** */

  /**
   * This function is invoked whenever an error is thrown during the refresh JWT process. It will
   * check if the user needs to sign in again.
   * @param error
   * @returns boolean
   */
  const __needsNewSession = (error: unknown): boolean => {
    const { code } = decodeError(error);
    return code === 4252;
  };

  /**
   * Refreshes an access token based on a long lived Refresh JWT.
   * @param refreshJWT
   * @returns Promise<string>
   * @throws
   * - 4250: if the jsonwebtoken lib fails to sign the token
   * - 4251: if the signed token has an invalid format
   * - 4252: if the lib fails to verify the JWT for any reason (most likely, the token expired)
   * - 4253: if the decoded data is an invalid object or does not contain the uid
   * - 4750: if there isn't a record that matches the refreshToken
   */
  const __refreshAccessJWT = async (): Promise<string> => {
    const response = await sendPOST(buildURL('auth/jwt/refresh-jwt'), undefined, [3, 5, 7]);
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error);
  };

  /**
   * This function is invoked whenever the Access JWT changes or needs to be retrieved. The behavior
   * of this function varies based on the data type of the newAccessJWT.
   * - string: the Access JWT was obtained via a different function (such as the
   * JWTService.signIn method)
   * - undefined: the user signed out, the Refresh JWT expired or the user is needed to sign again
   * for another reason
   * - null: the Access JWT must be retrieved from the API because the app has just been loaded or
   * because the Access JWT has expired
   * @param newAccessJWT
   * @throws
   * - 4250: if the jsonwebtoken lib fails to sign the token
   * - 4251: if the signed token has an invalid format
   * - 4252: if the lib fails to verify the JWT for any reason (most likely, the token expired)
   * - 4253: if the decoded data is an invalid object or does not contain the uid
   * - 4750: if there isn't a record that matches the refreshToken
   */
  const accessJWTChanged = async (newAccessJWT: string | null | undefined): Promise<void> => {
    // clear the refresh interval
    clearInterval(__accessJWTRefreshInterval);

    try {
      // if the passed Access JWT is null, means it needs to be extracted ASAP
      __accessJWT = newAccessJWT === null ? await __refreshAccessJWT() : newAccessJWT;
      useBoundStore.setState({ authenticated: jwtValid(__accessJWT) });

      // start the interval if the user is actually logged in
      if (typeof __accessJWT === 'string') {
        __accessJWTRefreshInterval = setInterval(async () => {
          try {
            __accessJWT = await __refreshAccessJWT();
          } catch (e) {
            if (__needsNewSession(e)) {
              return accessJWTChanged(undefined);
            }
            console.error(e);
          }
          return undefined;
        }, __ACCESS_JWT_DURATION * (60 * 1000));
      }
    } catch (e) {
      if (__needsNewSession(e)) {
        return accessJWTChanged(undefined);
      }
      console.error(e);
    }
    return undefined;
  };





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  /**
   * Builds the Headers that will be used to send a request to the API.
   * @param otpToken
   * @returns Headers
   */
  const __buildRequestHeaders = (otpToken: string | undefined): Headers => (new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    authorization: __accessJWT ?? '',
    'otp-token': otpToken ?? '',
  }));

  /**
   * Builds the options object that will be used to send a request to the API.
   * @param method
   * @param body
   * @param otpToken
   * @returns Partial<IOptions>
   */
  const __buildRequestOptions = (
    method: IRequestMethod,
    body: IRecord<unknown> | undefined,
    otpToken: string | undefined,
  ): Partial<IOptions> => ({
    requestOptions: {
      method,
      body,
      headers: __buildRequestHeaders(otpToken),
    },
    acceptableStatusCodes: [200],
  });

  /**
   * Sends a HTTP Request to the API and returns its response.
   * @param input
   * @param options
   * @param retryDelaySchedule
   * @returns Promise<IAPIResponse>
   */
  const __sendRequest = async (
    input: IRequestInput,
    options: Partial<IOptions>,
    retryDelaySchedule: number[] | undefined,
  ): Promise<IAPIResponse> => {
    const reqResponse = await send(input, options, retryDelaySchedule);
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
   * @returns Promise<unknown>
   */
  const request = async (
    method: IRequestMethod,
    path: string,
    body?: IRecord<unknown>,
    requiresAuth?: boolean,
    otpToken?: string,
    retryDelaySchedule: number[] = [3, 5, 7],
  ): Promise<unknown> => {
    // if it requires auth, the Access JWT must be set
    if (requiresAuth && typeof __accessJWT !== 'string') {
      throw new Error('The request requires the user to be authenticated but the Access JWT has not been set.');
    }

    // send the request
    const res = await __sendRequest(
      buildURL(path),
      __buildRequestOptions(method, body, otpToken),
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
      await accessJWTChanged(null);
      return request(method, path, body, requiresAuth, otpToken, retryDelaySchedule);
    }

    // if the API is going through the initialization process, try again after a delay
    if (code === 6002) {
      await delay(30);
      return request(method, path, body, requiresAuth, otpToken, retryDelaySchedule);
    }
    return undefined;
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    buildURL,

    // access JWT management
    accessJWTChanged,

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
  APIService,
};
