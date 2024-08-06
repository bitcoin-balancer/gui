import { objectValid } from '../../../backend/validations/index.service.ts';
import { type IAppEssentials } from '../../../backend/data-join/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Checks if a given payload is a complete App Essentials object.
 * @param payload
 * @returns boolean
 */
const isAppEssentialsObject = (payload: unknown): payload is IAppEssentials => (
  objectValid(payload) && typeof payload.serverTime === 'number'
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  isAppEssentialsObject,
};
