import { PropsWithChildren } from 'react';
import { IUser, IAuthority } from '../../../shared/backend/auth/user/index.service.ts';

/* ************************************************************************************************
 *                                           USER ROW                                             *
 ************************************************************************************************ */

// the props that will be passed down to the user row
type IUserRowProps = {
  // the user that will be places in the row
  user: IUser;

  // if enabled, there is an action being performed on the user
  busy: boolean;
};





/* ************************************************************************************************
 *                                           DISPATCH                                             *
 ************************************************************************************************ */

// the actions that are dispatched when users are mutated in order to keep the state in sync
type IActionType = 'ADD_USER' | 'UPDATE_NICKNAME' | 'UPDATE_AUTHORITY' | 'UPDATE_OTP_SECRET'
| 'DELETE_USER';
type IAction = {
  type: IActionType;
} & (
  | {
    type: 'ADD_USER';
    payload: IUser;
  }
  | {
    type: 'UPDATE_NICKNAME';
    payload: { uid: string, newNickname: string };
  }
  | {
    type: 'UPDATE_AUTHORITY';
    payload: { uid: string, newAuthority: IAuthority };
  }
  | {
    type: 'UPDATE_OTP_SECRET';
    payload: { uid: string, newOTPSecret: string };
  }
  | {
    type: 'DELETE_USER';
    payload: string;
  }
);




/* ************************************************************************************************
 *                                           ADD USER                                             *
 ************************************************************************************************ */

// the props used by the add user components
type IAddUserProps = PropsWithChildren<{
  dispatch: (action: IAction) => void;
}>;

// form inputs to add an user
type IAddUserInputs = {
  nickname: string;
  authority: IAuthority | '';
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // user row
  IUserRowProps,

  // dispatch
  IAction,

  // add user
  IAddUserProps,
  IAddUserInputs,
};
