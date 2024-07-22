import { StateCreator } from 'zustand';
import { IConfirmationDialogSlice } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Confirmation Dialog Slice
 * ...
 */
const createConfirmationDialogSlice: StateCreator<IConfirmationDialogSlice> = (
  set,
) => ({
  isOpen: false,
  onOpenChange: () => set((state) => ({ isOpen: !state.isOpen })),
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
