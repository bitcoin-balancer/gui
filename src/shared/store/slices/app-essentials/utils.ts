import { objectValid } from '@/shared/backend/validations/index.service.ts';
import { type IVersion } from '@/shared/backend/version/index.service.ts';
import { type IUser } from '@/shared/backend/auth/user/index.service.ts';
import { type IExchangeConfig } from '@/shared/backend/exchange/index.service.ts';
import type { IAppEssentials, ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';
import { IAppEssentialsSlice } from '@/shared/store/slices/app-essentials/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the app essentials in pristine state, before the data has been fetched from the API.
 * @returns Partial<IAppEssentials>
 */
const buildPristineState = (): Partial<IAppEssentials> => ({
  serverTime: undefined,
  version: undefined,
  unreadNotifications: undefined,
  unreadAPIErrors: undefined,
  user: undefined,
  exchangeConfig: undefined,
  marketState: undefined,
});

/**
 * Checks if a given payload is a complete App Essentials object.
 * @param payload
 * @returns boolean
 */
const __isAppEssentialsObject = (payload: unknown): payload is IAppEssentials => (
  objectValid(payload) && typeof payload.serverTime === 'number'
);





/* ************************************************************************************************
 *                                        STATE CALCULATORS                                       *
 ************************************************************************************************ */

/**
 * Calculates the new state when a complete app essentials object is provided.
 * @param payload
 * @returns IAppEssentials
 */
const __onNewAppEssentials = (payload: IAppEssentials): IAppEssentials => ({
  serverTime: payload.serverTime,
  version: payload.version,
  /* version: {
    gui: {
      ...payload.version.gui,
    },
    api: {
      ...payload.version.api,
      running: '1.0.1',
    },
    refetchTime: 0,
  }, */
  unreadNotifications: payload.unreadNotifications,
  unreadAPIErrors: payload.unreadAPIErrors,
  user: payload.user,
  exchangeConfig: payload.exchangeConfig,
  marketState: payload.marketState,
});

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
          // window: {},
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
const handleAppEssentialsChanges = (
  currentState: IAppEssentialsSlice,
  payload: IAppEssentials | ICompactAppEssentials,
): IAppEssentials => (
  __isAppEssentialsObject(payload)
    ? __onNewAppEssentials(payload)
    : __onNewCompactAppEssentials(currentState, payload)
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // helpers
  buildPristineState,

  // state calculators
  handleAppEssentialsChanges,
};
