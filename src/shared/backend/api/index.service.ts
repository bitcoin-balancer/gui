import { sendPOST } from 'fetch-request-browser';
import { ENVIRONMENT } from '../../../environment/environment.ts';
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
    const response = await sendPOST(buildURL('auth/jwt/refresh-jwt'));
    if (response.data.success) {
      return response.data.data;
    }
    throw new Error(response.data.error);
  };

  /**
   * This function is invoked whenever the Access JWT changes
   * @param newAccessJWT
   */
  const accessJWTChanged = (newAccessJWT: string | undefined): void => {
    __accessJWT = newAccessJWT;
    clearInterval(__accessJWTRefreshInterval);

    // start the interval if the user is actually logged in
    if (typeof newAccessJWT === 'string') {
      __accessJWTRefreshInterval = setInterval(async () => {
        try {
          __accessJWT = await __refreshAccessJWT();
        } catch (e) {
          console.error(e);
        }
      }, __ACCESS_JWT_DURATION * (60 * 1000));
    }
  };





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  // ...




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
    // ...
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
