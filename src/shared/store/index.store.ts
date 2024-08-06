import { create } from 'zustand';
import { createAuthenticatedSlice } from './slices/auth/index.slice.ts';
import { createConfirmationDialogSlice } from './slices/confirmation-dialog/index.slice.ts';
import { createAppEssentialsSlice } from './slices/app-essentials/index.slice.ts';
import { IBoundStore } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Bound Store
 * The combination of all existing state slices.
 */
const useBoundStore = create<IBoundStore>((set, get, api) => ({
  ...createAuthenticatedSlice(set, get, api),
  ...createConfirmationDialogSlice(set, get, api),
  ...createAppEssentialsSlice(set, get, api),
}));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IBoundStore,

  // store
  useBoundStore,
};
