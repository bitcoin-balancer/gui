import { IAuthenticatedSlice } from '@/shared/store/slices/auth/types.ts';
import { IInfoDialogSlice } from '@/shared/store/slices/info-dialog/index.slice.ts';
import { ILargeInfoDialogSlice } from './slices/large-info-dialog/index.slice.ts';
import { IConfirmationDialogSlice } from '@/shared/store/slices/confirmation-dialog/index.slice.ts';
import { IAppEssentialsSlice } from '@/shared/store/slices/app-essentials/index.slice.ts';
import { IPositionDialogSlice } from './slices/position-dialog/index.slice.ts';
import { ITransactionDialogSlice } from './slices/transaction-dialog/index.slice.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Bound Store
 * The type containing the types for all slices.
 */
type IBoundStore = IAuthenticatedSlice &
  IInfoDialogSlice &
  ILargeInfoDialogSlice &
  IConfirmationDialogSlice &
  IAppEssentialsSlice &
  IPositionDialogSlice &
  ITransactionDialogSlice;

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IBoundStore };
