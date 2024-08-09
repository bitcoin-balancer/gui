import { decodeError } from 'error-message-utils';
import { IOptions, IRequestMethod } from 'fetch-request-browser';
import { IRecord } from '@/shared/types.ts';
import { ENVIRONMENT } from '@/environment/environment.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the API's base path based on the environment and the window's location.
 * @returns string
 */
const __buildAPIBaseURL = (): string => {
  if (ENVIRONMENT.production) {
    const url = window.location;
    return `${url.protocol}//`;
  }
  return 'http://localhost:5075';
};





/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the API's base url that's used to build route paths
const __BASE_URL = __buildAPIBaseURL();





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * This function is invoked whenever an error is thrown during the refresh JWT process. It will
 * check if the user needs to sign in again.
 * @param error
 * @returns boolean
 */
const needsNewSession = (error: unknown): boolean => decodeError(error).code === 4252;

/**
 * Builds the URL that will be used to interact with an API's Resource.
 * @param resourcePath
 * @returns string
 */
const buildAPIURL = (resourcePath: string): string => `${ENVIRONMENT.apiURL}/${resourcePath}`;

/**
 * Builds the Headers that will be used to send a request to the API.
 * @param accessJWT
 * @param otpToken
 * @returns Headers
 */
const __buildRequestHeaders = (
  accessJWT: string | undefined,
  otpToken: string | undefined,
): Headers => (new Headers({
  Accept: 'application/json',
  'Content-Type': 'application/json',
  authorization: typeof accessJWT === 'string' ? `Bearer ${accessJWT}` : '',
  'otp-token': otpToken ?? '',
}));

/**
 * Builds the options object that will be used to send a request to the API.
 * @param method
 * @param body
 * @param otpToken
 * @returns Partial<IOptions>
 */
const buildRequestOptions = (
  method: IRequestMethod,
  body: IRecord<unknown> | undefined,
  accessJWT: string | undefined,
  otpToken: string | undefined,
): Partial<IOptions> => ({
  requestOptions: {
    method,
    body,
    headers: __buildRequestHeaders(accessJWT, otpToken),
    credentials: 'include',
  },
  acceptableStatusCodes: [200],
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  needsNewSession,
  buildAPIURL,
  buildRequestOptions,
};
