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
 *                                          USER DIALOG                                           *
 ************************************************************************************************ */

// the names for all the users' dialogs
type IDialogName = 'UPDATE_NICKNAME' | 'UPDATE_AUTHORITY' | 'DISPLAY_OTP_SECRET'
| 'DISPLAY_AUTH_SESSIONS' | 'DISPLAY_PASSWORD_UPDATES';

// the function triggered by dialogs when dismissed. It may contain an action to be dispatched
type IDialogCloseFunc = (action: IAction | false) => void;





/* ************************************************************************************************
 *                                           USER ROW                                             *
 ************************************************************************************************ */

// component props
type IUserRowProps = {
  user: IUser;
  dispatch: IDispatchFunc;
};





/* ************************************************************************************************
 *                                           ADD USER                                             *
 ************************************************************************************************ */

// component props
type IAddUserProps = PropsWithChildren<{
  dispatch: IDispatchFunc;
}>;

// form inputs
type IAddUserInputs = {
  nickname: string;
  authority: IAuthority | '';
};





/* ************************************************************************************************
 *                                       UPDATE NICKNAME                                          *
 ************************************************************************************************ */

// component props
type IUpdateNicknameProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  uid: string;
  nickname: string;
};

// form inputs
type IUpdateNicknameInputs = {
  newNickname: string;
};





/* ************************************************************************************************
 *                                        UPDATE AUTHORITY                                        *
 ************************************************************************************************ */

// component props
type IUpdateAuthorityProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  uid: string;
  nickname: string;
  authority: IAuthority;
};

// form inputs
type IUpdateAuthorityInputs = {
  newAuthority: IAuthority;
};





/* ************************************************************************************************
 *                                       DISPLAY OTP SECRET                                       *
 ************************************************************************************************ */

// component props
type IDisplayOTPSecretProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  uid: string;
  nickname: string;
};





/* ************************************************************************************************
 *                                     DISPLAY AUTH SESSIONS                                      *
 ************************************************************************************************ */

// component props
type IDisplayAuthSessionsProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  uid: string;
  nickname: string;
};





/* ************************************************************************************************
 *                                    DISPLAY PASSWORD UPDATES                                    *
 ************************************************************************************************ */

// component props
type IDisplayPasswordUpdatesProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  uid: string;
  nickname: string;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // dispatch
  IAction,
  IDispatchFunc,

  // user dialog
  IDialogName,

  // user row
  IUserRowProps,

  // add user
  IAddUserProps,
  IAddUserInputs,

  // update nickname
  IUpdateNicknameProps,
  IUpdateNicknameInputs,

  // update authority
  IUpdateAuthorityProps,
  IUpdateAuthorityInputs,

  // display otp secret
  IDisplayOTPSecretProps,

  // display auth sessions
  IDisplayAuthSessionsProps,

  // display password updates
  IDisplayPasswordUpdatesProps,
};
