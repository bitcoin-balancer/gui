import { APIService } from '../../api/index.service';
import { IPasswordUpdate, IUser, IUserService } from './types';

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
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    listUsers,
    listUserPasswordUpdates,

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
