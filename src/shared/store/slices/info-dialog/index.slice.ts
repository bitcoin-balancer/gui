import { StateCreator } from 'zustand';
import { IInfoDialogConfig, IInfoDialogSlice } from '@/shared/store/slices/info-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Info Dialog Slice
 * Creates the slice in charge of managing the state of the info dialog.
 */
const createInfoDialogSlice: StateCreator<IInfoDialogSlice> = (set) => ({
  isInfoDialogOpen: false,
  infoDialogConfig: undefined,
  openInfoDialog: (config: IInfoDialogConfig) =>
    set(() => ({
      isInfoDialogOpen: true,
      infoDialogConfig: config,
    })),
  closeInfoDialog: () =>
    set(() => ({
      isInfoDialogOpen: false,
    })),
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IInfoDialogSlice,

  // slice
  createInfoDialogSlice,
};
