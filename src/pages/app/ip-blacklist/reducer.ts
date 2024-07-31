import { IIPBlacklistRecord } from '../../../shared/backend/ip-blacklist/index.service.ts';
import { IAction } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dispatches an action and updates the state so it is in sync with the backend.
 * @param action
 * @param state
 * @param setState
 */
const dispatch = (
  action: IAction,
  state: IIPBlacklistRecord[],
  setState: (state: IIPBlacklistRecord[]) => void,
) => {
  switch (action.type) {
    case 'REGISTER_IP': {
      setState([action.payload, ...state]);
      break;
    }
    case 'UPDATE_REGISTRATION': {
      setState(state.map((record) => {
        if (record.id === action.payload.id) {
          return { ...record, ip: action.payload.ip, notes: action.payload.notes };
        }
        return record;
      }));
      break;
    }
    case 'UNREGISTER_IP': {
      setState(state.filter((record) => record.id !== action.payload));
      break;
    }
    default:
      throw new Error(`The action '${JSON.stringify(action)}' is invalid`);
  }
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  dispatch,
};
