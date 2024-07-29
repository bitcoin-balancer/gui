import { IUser } from '../../../shared/backend/auth/user/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the props that will be passed down to the user row
type IUserRowProps = {
  // the user that will be places in the row
  user: IUser;

  // if enabled, there is an action being performed on the user
  busy: boolean;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IUserRowProps,
};
