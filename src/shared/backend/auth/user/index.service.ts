import { APIService } from '../../api/index.service';
import {
  IUserService,
  IAuthority,
  IUser,
  IPasswordUpdate,
} from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * User Service Factory
 * Generates the object in charge of creating and managing users.
 * @returns IUserService
 */
const userServiceFactory = (): IUserService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves the list of existing user records ordered by authority descendingly.
   * @returns Promise<IUser[]>
   */
  const listUsers = (): Promise<IUser[]> => APIService.request(
    'GET',
    'auth/user',
    undefined,
    true,
  ) as Promise<IUser[]>;

  /**
   * Retrieves the list of password update records for a uid.
   * @param uid
   * @param startAtEventTime?
   * @returns Promise<IPasswordUpdate[]>
   * @throws
   * - 3506: if the uid has an invalid format
   * - 3507: if the record doesn't exist in the database
   * - 3508: if the record belongs to the root and has not been explicitly allowed
   * - 3511: if the starting point is provided but it's not a valid unix timestamp
   */
  const listUserPasswordUpdates = (
    uid: string,
    startAtEventTime?: number,
  ): Promise<IPasswordUpdate[]> => {
    let urlPath: string = `auth/user/password-updates/${uid}`;
    if (typeof startAtEventTime === 'number') {
      urlPath += `?startAtEventTime=${startAtEventTime}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    ) as Promise<IPasswordUpdate[]>;
  };





  /* **********************************************************************************************
   *                                    USER RECORD MANAGEMENT                                    *
   ********************************************************************************************** */

  /**
   * Creates a User Record and returns it.
   * @param nickname
   * @param authority
   * @param otpToken
   * @returns Promise<IUser>
  * @throws
  * - 3500: if the format of the nickname is invalid
  * - 3501: if the nickname is already being used
  * - 3502: if the root's authority is not the highest
  * - 3503: if the root's password is invalid or weak
  * - 3504: if a password is provided when creating a nonroot user
  * - 3505: if the authority provided is not ranging 1 - 4
  */
  const createUser = (
    nickname: string,
    authority: IAuthority,
    otpToken: string,
  ): Promise<IUser> => APIService.request(
    'POST',
    'auth/user',
    { nickname, authority },
    true,
    otpToken,
  ) as Promise<IUser>;

  /**
   * Updates a nonroot user's nickname.
   * @param uid
   * @param newNickname
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 3500: if the format of the nickname is invalid
   * - 3501: if the nickname is already being used
   * - 3506: if the uid has an invalid format
   * - 3507: if the record doesn't exist in the database
   * - 3508: if the record belongs to the root and has not been explicitly allowed
   */
  const updateNickname = (
    uid: string,
    newNickname: string,
    otpToken: string,
  ): Promise<void> => APIService.request(
    'PATCH',
    `auth/user/${uid}/nickname`,
    { newNickname },
    true,
    otpToken,
  ) as Promise<void>;

  /**
   * Updates a nonroot user's authority.
   * @param uid
   * @param newAuthority
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 3505: if the authority provided is not ranging 1 - 4
   * - 3506: if the uid has an invalid format
   * - 3507: if the record doesn't exist in the database
   * - 3508: if the record belongs to the root and has not been explicitly allowed
   */
  const updateAuthority = (
    uid: string,
    newAuthority: IAuthority,
    otpToken: string,
  ): Promise<void> => APIService.request(
    'PATCH',
    `auth/user/${uid}/authority`,
    { newAuthority },
    true,
    otpToken,
  ) as Promise<void>;

  /**
   * Updates a nonroot user's password hash.
   * @param nickname
   * @param newPassword
   * @param otpToken
   * @param altchaPayload
   * @returns Promise<void>
   * @throws
   * - 3252: if no record is found for the nickname
   * - 3508: if attempting to update the root's password
   * - 3509: if the password is invalid or too weak
   * - 2000: the altcha payload has an invalid format
   * - 2001: the altcha solution is invalid or it has expired
   * - 3250: if the user record does not exist or the OTP Secret is not valid
   * - 3506: if the uid has an invalid format
   * - 3510: if the OTP Token has an invalid format
   * - 3000: if the OTP Token failed the verification
   */
  const updatePassword = (
    nickname: string,
    newPassword: string,
    otpToken: string,
    altchaPayload: string,
  ): Promise<void> => APIService.request(
    'PATCH',
    'auth/user/password',
    {
      nickname,
      newPassword,
      otpToken,
      altchaPayload,
    },
  ) as Promise<void>;

  /**
   * Updates a nonroot user's OTP Secret. The new secret is returned on completion.
   * @param uid
   * @returns Promise<string>
   * @throws
   * - 3506: if the uid has an invalid format
   * - 3507: if the record doesn't exist in the database
   * - 3508: if the record belongs to the root and has not been explicitly allowed
   */
  const updateOTPSecret = (uid: string, otpToken: string): Promise<string> => APIService.request(
    'PATCH',
    `auth/user/${uid}/otp-secret`,
    undefined,
    true,
    otpToken,
  ) as Promise<string>;

  /**
   * Deletes a nonroot user account.
   * @param uid
   * @returns Promise<void>
   * @throws
   * - 3506: if the uid has an invalid format
   * - 3507: if the record doesn't exist in the database
   * - 3508: if the record belongs to the root and has not been explicitly allowed
   */
  const deleteUser = (uid: string, otpToken: string): Promise<void> => APIService.request(
    'DELETE',
    `auth/user/${uid}`,
    undefined,
    true,
    otpToken,
  ) as Promise<void>;





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    listUsers,
    listUserPasswordUpdates,

    // user record management
    createUser,
    updateNickname,
    updateAuthority,
    updatePassword,
    updateOTPSecret,
    deleteUser,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const UserService = userServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  UserService,
};
