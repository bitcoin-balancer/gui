import { StateCreator } from 'zustand';
import type { IAppEssentials, ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';
import { buildPristineState, handleAppEssentialsChanges } from '@/shared/store/slices/app-essentials/utils.ts';
import { type IAppEssentialsSlice } from '@/shared/store/slices/app-essentials/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App Essentials Slice
 * Creates the slice in charge of managing the state of the app essentials.
 */
const createAppEssentialsSlice: StateCreator<IAppEssentialsSlice> = (
  set,
) => ({
  ...buildPristineState(),
  setAppEssentials: (payload: IAppEssentials | ICompactAppEssentials) => set(
    (state) => handleAppEssentialsChanges(state, payload),
  ),
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // slice
  createAppEssentialsSlice,

  // types
  type IAppEssentialsSlice,
};
