import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Large Info Dialog Slice
 * ...
 */
type ILargeInfoDialogSlice = {
  // if enabled, the dialog will be present on the document
  isLargeInfoDialogOpen: ISectionID | undefined;

  // the dialog's controllers
  openLargeInfoDialog: (data: ISectionID) => void;
  closeLargeInfoDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  ILargeInfoDialogSlice,
};
