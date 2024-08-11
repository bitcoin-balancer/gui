import { create } from 'zustand';
import { subscribeWithSelector } from 'zustand/middleware';
import { createAuthenticatedSlice } from '@/shared/store/slices/auth/index.slice.ts';
import { createConfirmationDialogSlice } from '@/shared/store/slices/confirmation-dialog/index.slice.ts';
import { createAppEssentialsSlice } from '@/shared/store/slices/app-essentials/index.slice.ts';
import { IBoundStore } from '@/shared/store/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Bound Store
 * The combination of all existing state slices.
 */
const useBoundStore = create(
  subscribeWithSelector<IBoundStore>((set, get, api) => ({
    ...createAuthenticatedSlice(set, get, api),
    ...createConfirmationDialogSlice(set, get, api),
    ...createAppEssentialsSlice(set, get, api),
  })),
);
/* const useBoundStore = create<IBoundStore>((set, get, api) => ({
  ...createAuthenticatedSlice(set, get, api),
  ...createConfirmationDialogSlice(set, get, api),
  ...createAppEssentialsSlice(set, get, api),
})); */




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IBoundStore,

  // store
  useBoundStore,
};
