import { ITransaction } from '@/shared/backend/position/transaction/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Transaction Dialog Slice
 * ...
 */
type ITransactionDialogSlice = {
  // if enabled, the dialog will be present on the document
  isTransactionDialogOpen: number | ITransaction | undefined;

  // the dialog's controllers
  openTransactionDialog: (data: number | ITransaction) => void;
  closeTransactionDialog: () => void;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { ITransactionDialogSlice };
