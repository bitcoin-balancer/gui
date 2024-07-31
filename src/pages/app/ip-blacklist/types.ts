import { IIPBlacklistRecord } from '../../../shared/backend/ip-blacklist/index.service.ts';

/* ************************************************************************************************
 *                                           DISPATCH                                             *
 ************************************************************************************************ */

// the actions that are dispatched when users are mutated in order to keep the state in sync
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

// component props
type IRecordFormProps = {
  open: IIPBlacklistRecord | null | false;
  onOpenChange: (action: IAction | false) => void;
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
