import { decodeError } from 'error-message-utils';
import { IOptions, IRequestMethod } from 'fetch-request-browser';
import { ENVIRONMENT } from '@/environment/environment.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Verifies if a given hostname is an IP address.
 * @param hostname
 * @returns boolean
 */
const isIPAddress = (hostname: string): boolean => {
  const ipPattern =
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;
  return ipPattern.test(hostname);
};

/**
 * Extracts the domain name based on a given hostname (www-less url).
 * @param hostname
 * @returns string
 */
const __getDomainName = (hostname: string): string => {
  const parts = hostname.split('.');
  if (parts.length === 2) {
    return hostname;
  }
  return parts.slice(1).join('.');
};

/**
 * Builds the API's base path based on the environment and the window's location.
 * @returns string
 */
const __buildAPIBaseURL = (): string => {
  if (ENVIRONMENT.production) {
    // handle when the hostname is an IP address
    const { hostname } = window.location;
    if (isIPAddress(hostname)) {
      return `${window.location.protocol}//${hostname}:5075`;
    }

    // handle when the hostname is a domain name
    const www = hostname.includes('www') ? 'www.' : '';
    const domain =
      www.length > 0
        ? __getDomainName(hostname.substring(hostname.indexOf('.') + 1))
        : __getDomainName(hostname);
    return `${window.location.protocol}//${www}balancerapi.${domain}`;
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
const needsNewSession = (error: unknown): boolean => {
  const { code } = decodeError(error);
  return code === 4252 || code === 4750;
};

/**
 * Builds the URL that will be used to interact with an API's Resource.
 * @param resourcePath
 * @returns string
 */
const buildAPIURL = (resourcePath: string): string => `${__BASE_URL}/${resourcePath}`;

/**
 * Builds the Headers that will be used to send a request to the API.
 * @param accessJWT
 * @param otpToken
 * @returns Headers
 */
const __buildRequestHeaders = (
  accessJWT: string | undefined,
  otpToken: string | undefined,
): Headers =>
  new Headers({
    Accept: 'application/json',
    'Content-Type': 'application/json',
    authorization: typeof accessJWT === 'string' ? `Bearer ${accessJWT}` : '',
    'otp-token': otpToken ?? '',
  });

/**
 * Builds the options object that will be used to send a request to the API.
 * @param method
 * @param body
 * @param otpToken
 * @returns Partial<IOptions>
 */
const buildRequestOptions = (
  method: IRequestMethod,
  body: Record<string, unknown> | Array<unknown> | undefined,
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
  // helpers
  __buildAPIBaseURL,

  // implementation
  needsNewSession,
  buildAPIURL,
  buildRequestOptions,
};
