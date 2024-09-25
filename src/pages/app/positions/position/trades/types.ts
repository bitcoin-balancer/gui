import { ISide, ITrade } from '@/shared/backend/exchange/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the object generated out of each trade to improve the dx
type ITradeMetadata = {
  event_time: string;
  price: string;
  amount: string;
  comission: string;
  positionAmount: string;
};





/* ************************************************************************************************
 *                                           DISPATCH                                             *
 ************************************************************************************************ */

// the actions that are dispatched when records are mutated in order to keep the state in sync
type IActionType = 'CREATE_TRADE' | 'UPDATE_TRADE' | 'DELETE_TRADE';
type IAction = {
  type: IActionType;
} & (
  | {
    type: 'CREATE_TRADE';
    payload: ITrade;
  }
  | {
    type: 'UPDATE_TRADE';
    payload: ITrade;
  }
  | {
    type: 'DELETE_TRADE';
    payload: number;
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
type IDialogRecord = ITrade | null | undefined;

// component props
type IRecordFormProps = {
  record: IDialogRecord;
  closeDialog: (action: IAction | undefined) => void;
};

// form inputs
type IRecordFormInputs = {
  event_time: Date;
  side: ISide;
  notes: string;
  price: string;
  amount: string;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // types
  ITradeMetadata,

  // dispatch
  IActionType,
  IAction,

  // record form
  IDialogRecord,
  IRecordFormProps,
  IRecordFormInputs,
};
