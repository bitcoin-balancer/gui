

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * JWT Service
 * Object in charge of managing the authentication of users.
 */
type IJWTService = {
  // properties
  // ...

  // retrievers
  listRecords: (uid: string) => Promise<IRefreshTokenRecord[]>;

  // auth actions
  signIn: (
    nickname: string,
    password: string,
    otpToken: string,
    altchaPayload: string,
  ) => Promise<void>;
  signOut: (allDevices?: boolean) => Promise<void>;
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Refresh Token
 * A record is generated and stored whenever a user signs in on a device.
 */
type IRefreshTokenRecord = {
  // the owner of the token
  uid: string;

  // the refresh token
  token: string;

  // the time at which the token was issued
  event_time: string;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IJWTService,

  // types
  IRefreshTokenRecord,
};
