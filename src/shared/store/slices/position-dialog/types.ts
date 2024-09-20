import { IPosition } from '@/shared/backend/position/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Position Dialog Slice
 * ...
 */
type IPositionDialogSlice = {
  // if enabled, the dialog will be present on the document
  isPositionDialogOpen: string | IPosition | undefined;

  // the dialog's controllers
  openPositionDialog: (data: string | IPosition) => void;
  closePositionDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPositionDialogSlice,
};
