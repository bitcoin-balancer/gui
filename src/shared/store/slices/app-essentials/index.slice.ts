import { StateCreator } from 'zustand';
import { type IVersion } from '@/shared/backend/version/index.service.ts';
import { type IUser } from '@/shared/backend/auth/user/index.service.ts';
import { type IExchangeConfig } from '@/shared/backend/exchange/index.service.ts';
import { CandlestickService } from '@/shared/backend/candlestick/index.service.ts';
import type { IAppEssentials, ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';
import { buildPristineState, isAppEssentialsObject } from '@/shared/store/slices/app-essentials/utils.ts';
import { type IAppEssentialsSlice } from '@/shared/store/slices/app-essentials/types.ts';

/* ************************************************************************************************
 *                                         STATE HANDLER                                          *
 ************************************************************************************************ */

/**
 * Processes the compact app essentials object. Since there is a race condition between the initial
 * AppEssentials fetch and the Socket.io connection (CompactAppEssentials), it is important to
 * ensure the full AppEssentials object is set before processing any compact updates.
 * @param currentState
 * @param payload
 * @returns IAppEssentials
 */
const __onNewCompactAppEssentials = (
  currentState: IAppEssentialsSlice,
  payload: ICompactAppEssentials,
): IAppEssentials => (
  currentState.serverTime === undefined
    ? <IAppEssentials>buildPristineState()
    : {
      serverTime: <number>currentState.serverTime,
      version: <IVersion>currentState.version,
      unreadNotifications: payload.unreadNotifications,
      unreadAPIErrors: payload.unreadAPIErrors,
      user: <IUser>currentState.user,
      exchangeConfig: <IExchangeConfig>currentState.exchangeConfig,
      marketState: {
        windowState: {
          ...payload.marketState.windowState,
          window: CandlestickService.syncRecords(
            currentState.marketState!.windowState.window,
            payload.marketState.windowState.window,
          ),
        },
      },
    }
);

/**
 * Calculates the new state based on the type of payload.
 * @param currentState
 * @param payload
 * @returns IAppEssentials
 */
const __onNewAppEssentials = (
  currentState: IAppEssentialsSlice,
  payload: IAppEssentials | ICompactAppEssentials,
): IAppEssentials => (
  isAppEssentialsObject(payload)
    ? payload
    : __onNewCompactAppEssentials(currentState, payload)
);





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
    (state) => __onNewAppEssentials(state, payload),
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
