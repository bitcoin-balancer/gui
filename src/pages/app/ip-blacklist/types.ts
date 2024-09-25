import { IIPBlacklistRecord } from '@/shared/backend/ip-blacklist/index.service.ts';

/* ************************************************************************************************
 *                                           DISPATCH                                             *
 ************************************************************************************************ */

// the actions that are dispatched when records are mutated in order to keep the state in sync
type IActionType = 'REGISTER_IP' | 'UPDATE_REGISTRATION' | 'UNREGISTER_IP' | 'LOADED_MORE';
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
  | {
    type: 'LOADED_MORE';
    payload: IIPBlacklistRecord[];
  }
);





/* ************************************************************************************************
 *                                         RECORD FORM                                            *
 ************************************************************************************************ */

/**
 * Dialog Record
 * The type of records that can exist. If undefined, the dialog won't be in the DOM, null will
 * display the create record form while a record show the update form.
 */
type IDialogRecord = IIPBlacklistRecord | null | undefined;

// component props
type IRecordFormProps = {
  record: IDialogRecord;
  closeDialog: (action: IAction | undefined) => void;
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
  IDialogRecord,
  IRecordFormProps,
  IRecordFormInputs,
};
