import { StateCreator } from 'zustand';
import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';
import { ILargeInfoDialogSlice } from '@/shared/store/slices/large-info-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Large Info Dialog Slice
 * Creates the slice in charge of displaying large pieces of information.
 */
const createLargeInfoDialogSlice: StateCreator<ILargeInfoDialogSlice> = (set) => ({
  isLargeInfoDialogOpen: undefined,
  openLargeInfoDialog: (data: ISectionID) =>
    set(() => ({
      isLargeInfoDialogOpen: data,
    })),
  closeLargeInfoDialog: () =>
    set(() => ({
      isLargeInfoDialogOpen: undefined,
    })),
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type ILargeInfoDialogSlice,

  // slice
  createLargeInfoDialogSlice,
};
