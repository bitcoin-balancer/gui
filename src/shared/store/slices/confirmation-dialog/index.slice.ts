import { StateCreator } from 'zustand';
import { IConfirmationDialogConfig, IConfirmationDialogSlice } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Confirmation Dialog Slice
 * Slice in charge of managing the state of the confirmation dialog.
 */
const createConfirmationDialogSlice: StateCreator<IConfirmationDialogSlice> = (
  set,
) => ({
  isConfirmationDialogOpen: false,
  confirmationDialogConfig: undefined,
  openConfirmationDialog: (config: IConfirmationDialogConfig) => set(() => ({
    isConfirmationDialogOpen: true,
    confirmationDialogConfig: config,
  })),
  closeConfirmationDialog: () => set(() => ({ isConfirmationDialogOpen: false })),
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IConfirmationDialogSlice,

  // slice
  createConfirmationDialogSlice,
};
