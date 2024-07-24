import { create } from 'zustand';
import { createConfirmationDialogSlice } from './slices/confirmation-dialog/index.slice.ts';
import { IBoundStore } from './types.ts';
import { createAuthenticatedSlice } from './slices/auth/index.slice.ts';

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
