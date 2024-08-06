import { IAuthenticatedSlice } from './slices/auth/types.ts';
import { IConfirmationDialogSlice } from './slices/confirmation-dialog/index.slice.ts';
import { IAppEssentialsSlice } from './slices/app-essentials/index.slice.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Bound Store
 * The type containing the types for all slices.
 */
type IBoundStore = IAuthenticatedSlice & IConfirmationDialogSlice & IAppEssentialsSlice;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IBoundStore,
};
