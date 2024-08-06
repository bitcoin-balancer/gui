import { IAuthenticatedSlice } from '@/shared/store/slices/auth/types.ts';
import { IConfirmationDialogSlice } from '@/shared/store/slices/confirmation-dialog/index.slice.ts';
import { IAppEssentialsSlice } from '@/shared/store/slices/app-essentials/index.slice.ts';

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
