import { StateCreator } from 'zustand';
import { ITransaction } from '@/shared/backend/position/transaction/index.service.ts';
import { ITransactionDialogSlice } from '@/shared/store/slices/transaction-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Transaction Dialog Slice
 * Creates the slice in charge of displaying the transaction dialog.
 */
const createTransactionDialogSlice: StateCreator<ITransactionDialogSlice> = (
  set,
) => ({
  isTransactionDialogOpen: undefined,
  openTransactionDialog: (data: number | ITransaction) => set(() => ({
    isTransactionDialogOpen: data,
  })),
  closeTransactionDialog: () => set(() => ({
    isTransactionDialogOpen: undefined,
  })),
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type ITransactionDialogSlice,

  // slice
  createTransactionDialogSlice,
};
