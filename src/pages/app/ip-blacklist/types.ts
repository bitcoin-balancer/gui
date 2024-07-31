import { IIPBlacklistRecord } from '../../../shared/backend/ip-blacklist/index.service.ts';



/* ************************************************************************************************
 *                                           DISPATCH                                             *
 ************************************************************************************************ */

// the actions that are dispatched when users are mutated in order to keep the state in sync
type IActionType = 'REGISTER_IP' | 'UPDATE_REGISTRATION' | 'UNREGISTER_IP';
type IAction = {
  type: IActionType;
} & (
  | {
    type: 'REGISTER_IP';
    payload: IIPBlacklistRecord;
  }
  | {
    type: 'UPDATE_REGISTRATION';
    payload: { id: number, ip: string, notes: string | undefined };
  }
  | {
    type: 'UNREGISTER_IP';
    payload: number;
  }
);


// the function triggered by dialogs when dismissed. It may contain an action to be dispatched
type IDialogCloseFunc = (action: IAction | false) => void;





/* ************************************************************************************************
 *                                         RECORD FORM                                            *
 ************************************************************************************************ */

// component props
type IRecordFormProps = {
  open: boolean;
  onOpenChange: IDialogCloseFunc;
  record: IIPBlacklistRecord
};

// form inputs
type IRecordFormInputs = {
  ip: string;
  notes: string;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // dispatch
  IAction,

  // record form
  IRecordFormProps,
  IRecordFormInputs,
};
