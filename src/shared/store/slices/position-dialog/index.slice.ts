import { StateCreator } from 'zustand';
import { IPosition } from '@/shared/backend/position/index.service.ts';
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
  openPositionDialog: (data: string | IPosition) => set(() => ({
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
