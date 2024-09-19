

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Position Dialog Slice
 * ...
 */
type IPositionDialogSlice = {
  // if enabled, the dialog will be present on the document
  isPositionDialogOpen: string | undefined;

  // the dialog's controllers
  openPositionDialog: (data: string) => void;
  closePositionDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPositionDialogSlice,
};
