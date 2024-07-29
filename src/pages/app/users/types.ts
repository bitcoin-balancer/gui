import { PropsWithChildren } from 'react';
import { IUser, IAuthority } from '../../../shared/backend/auth/user/index.service.ts';

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

// the function used to dispatch actions from children components
type IDispatchFunc = (action: IAction) => void;





/* ************************************************************************************************
 *                                           USER ROW                                             *
 ************************************************************************************************ */

// the props that will be passed down to the user row
type IUserRowProps = {
  user: IUser;
  dispatch: IDispatchFunc;
};





/* ************************************************************************************************
 *                                           ADD USER                                             *
 ************************************************************************************************ */

// the props used by the add user components
type IAddUserProps = PropsWithChildren<{
  dispatch: IDispatchFunc;
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
  // dispatch
  IAction,
  IDispatchFunc,

  // user row
  IUserRowProps,

  // add user
  IAddUserProps,
  IAddUserInputs,
};
