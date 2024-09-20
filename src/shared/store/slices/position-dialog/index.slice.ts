import { StateCreator } from 'zustand';
import { IPositionDialogSlice } from '@/shared/store/slices/position-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Dialog Slice
 * Creates the slice in charge of displaying the position dialog.
 */
const createPositionDialogSlice: StateCreator<IPositionDialogSlice> = (
  set,
) => ({
  isPositionDialogOpen: undefined,
  openPositionDialog: (data: string) => set(() => ({
    isPositionDialogOpen: data,
  })),
  closePositionDialog: () => set(() => ({
    isPositionDialogOpen: undefined,
  })),
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IPositionDialogSlice,

  // slice
  createPositionDialogSlice,
};