import { APIService } from '../../api/index.service';
import { IJWTService, IRefreshTokenRecord } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * JWT Service Factory
 * Generates the object in charge of managing the authentication of users.
 * @returns IJWTService
 */
const jwtServiceFactory = (): IJWTService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Validates and lists the refresh token records for an uid.
   * @param uid
   * @returns Promise<IRefreshTokenRecord[]>
   * @throws
   * - 4500: if the uid has an invalid format
   */
  const listRecords = (uid: string): Promise<IRefreshTokenRecord[]> => APIService.request(
    'GET',
    `auth/jwt/${uid}`,
    undefined,
    true,
  ) as Promise<IRefreshTokenRecord[]>;





  /* **********************************************************************************************
   *                                         AUTH ACTIONS                                         *
   ********************************************************************************************** */

  /**
   * Verifies the user's credentials and executes the authentication process. Once it completes, it
   * also updates the authenticated state via the APIService.
   * @param nickname
   * @param password
   * @param otpToken
   * @param altchaPayload
   * @returns Promise<void>
   * @throws
   * - 3500: if the nickname's format is invalid
   * - 3509: if the pasword's format is invalid or is too weak
   * - 3510: if the OTP Token's format is invalid
   * - 2000: the altcha payload has an invalid format
   * - 2001: the altcha solution is invalid or it has expired
   * - 3004: if the password verification fails
   * - 3005: hides the original error in production to avoid leaking information
   * - 4250: if the jsonwebtoken lib fails to sign the token
   * - 4251: if the signed token has an invalid format
   */
  const signIn = async (
    nickname: string,
    password: string,
    otpToken: string,
    altchaPayload: string,
  ): Promise<void> => {
    const accessJWT = await APIService.request(
      'POST',
      'auth/jwt/sign-in',
      {
        nickname,
        password,
        otpToken,
        altchaPayload,
      },
    ) as string;
    await APIService.accessJWTChanged(accessJWT);
  };



  /**
   * Signs an user out from a single or multiple devices in one go. Once it completes, it also
   * updates the authenticated state via the APIService.
   * @param allDevices?
   * @returns Promise<void>
   * @throws
   * - 4500: if the uid has an invalid format
   * - 4501: if the Refresh JWT has an invalid format
   */
  const signOut = async (allDevices?: boolean): Promise<void> => {
    await APIService.request(
      'POST',
      'auth/jwt/sign-out',
      { allDevices },
      true,
    );
    await APIService.accessJWTChanged(undefined);
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    listRecords,

    // auth actions
    signIn,
    signOut,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const JWTService = jwtServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  JWTService,
};
