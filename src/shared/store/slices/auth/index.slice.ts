import { StateCreator } from 'zustand';
import { IAuthenticatedSlice } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Authenticated Slice
 * Creates the slice in charge of managing the state of the user's authentication.
 */
const createAuthenticatedSlice: StateCreator<IAuthenticatedSlice> = (
  set,
) => ({
  authenticated: undefined,
  setAuthenticated: (authState: boolean) => set(() => ({ authenticated: authState })),
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // types
  type IAuthenticatedSlice,

  // slice
  createAuthenticatedSlice,
};
