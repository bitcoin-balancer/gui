import { isObjectValid } from 'web-utils-kit';
import type { IAppEssentials } from '@/shared/backend/data-join/index.service.ts';

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
const isAppEssentialsObject = (payload: unknown): payload is IAppEssentials =>
  isObjectValid(payload) && typeof payload.serverTime === 'number';

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { buildPristineState, isAppEssentialsObject };
