import { sendPOST } from 'fetch-request-browser';
import { jwtValid } from '@/shared/backend/validations/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { buildAPIURL, needsNewSession } from '@/shared/backend/api/utils.ts';
import { IAccessJWTService } from '@/shared/backend/api/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Access JWT Service Factory
 * Generates the object in charge of managing the Authentication's Access JWT for API Requests and
 * the global state.
 * @returns IAccessJWTService
 */
const accessJWTServiceFactory = (): IAccessJWTService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the number of minutes an access token is valid for
  const __ACCESS_JWT_DURATION = 14;

  // the interval in charge of refreshing the JWT before it expires
  let __accessJWTRefreshInterval: NodeJS.Timeout | undefined;

  // the current Access JWT
  let __current: string | undefined;





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
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
    const response = await sendPOST(
      buildAPIURL('auth/jwt/refresh-jwt'),
      {
        requestOptions: {
          credentials: 'include',
        },
      },
      [3, 5, 7],
    );
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
      __current = newAccessJWT === null ? await __refreshAccessJWT() : newAccessJWT;
      useBoundStore.setState({ authenticated: jwtValid(__current) });

      // start the interval if the user is actually logged in
      if (typeof __current === 'string') {
        __accessJWTRefreshInterval = setInterval(async () => {
          try {
            __current = await __refreshAccessJWT();
          } catch (e) {
            if (needsNewSession(e)) {
              return accessJWTChanged(undefined);
            }
            console.error(e);
          }
          return undefined;
        }, __ACCESS_JWT_DURATION * (60 * 1000));
      }
    } catch (e) {
      if (needsNewSession(e)) {
        return accessJWTChanged(undefined);
      }
      console.error(e);
    }
    return undefined;
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get current() {
      return __current;
    },

    // actions
    accessJWTChanged,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const AccessJWTService = accessJWTServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  AccessJWTService,
};
