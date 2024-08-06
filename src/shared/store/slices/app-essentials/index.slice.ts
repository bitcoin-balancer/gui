import { StateCreator } from 'zustand';
import { IVersion } from '../../../backend/version/index.service.ts';
import { type IUser } from '../../../backend/auth/user/index.service.ts';
import type { IAppEssentials, ICompactAppEssentials } from '../../../backend/data-join/index.service.ts';
import { isAppEssentialsObject } from './utils.ts';
import { type IAppEssentialsSlice } from './types.ts';

/* ************************************************************************************************
 *                                       STATE CALCULATORS                                        *
 ************************************************************************************************ */

/**
 * Calculates the new state when a compact app essentials object is provided.
 * @param currentState
 * @param payload
 * @returns IAppEssentials
 */
const __onNewCompactAppEssentials = (
  currentState: IAppEssentialsSlice,
  payload: ICompactAppEssentials,
): IAppEssentials => ({
  serverTime: <number>currentState.serverTime,
  version: <IVersion>currentState.version,
  unreadAPIErrors: payload.unreadAPIErrors,
  user: <IUser>currentState.user,
});

/**
 * Calculates the new state when a complete app essentials object is provided.
 * @param payload
 * @returns IAppEssentials
 */
const __onNewAppEssentials = (payload: IAppEssentials): IAppEssentials => ({
  serverTime: payload.serverTime,
  version: payload.version,
  unreadAPIErrors: payload.unreadAPIErrors,
  user: payload.user,
});

/**
 * Calculates the new state based on the type of payload.
 * @param currentState
 * @param payload
 * @returns IAppEssentials
 */
const __calculateNewState = (
  currentState: IAppEssentialsSlice,
  payload: IAppEssentials | ICompactAppEssentials,
): IAppEssentials => {
  if (isAppEssentialsObject(payload)) {
    return __onNewAppEssentials(payload);
  }
  return __onNewCompactAppEssentials(currentState, payload);
};





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
  serverTime: undefined,
  version: undefined,
  unreadAPIErrors: undefined,
  user: undefined,
  setAppEssentials: (payload: IAppEssentials | ICompactAppEssentials) => set(
    (state) => __calculateNewState(state, payload),
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
