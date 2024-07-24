import { IAuthenticatedSlice } from './slices/auth/types.ts';
import { IConfirmationDialogSlice } from './slices/confirmation-dialog/index.slice.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Bound Store
 * The type containing the types for all slices.
 */
type IBoundStore = IAuthenticatedSlice & IConfirmationDialogSlice;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IBoundStore,
};
