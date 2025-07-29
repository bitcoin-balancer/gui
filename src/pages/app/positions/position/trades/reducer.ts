import { sortRecords } from 'web-utils-kit';
import { ITrade } from '@/shared/backend/exchange/index.service.ts';
import { IAction } from '@/pages/app/positions/position/trades/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dispatches an action and updates the state so it is in sync with the backend.
 * @param action
 * @param state
 * @param setState
 */
const dispatch = (action: IAction, state: ITrade[], setState: (state: ITrade[]) => void) => {
  switch (action.type) {
    case 'CREATE_TRADE': {
      setState([action.payload, ...state].sort(sortRecords('event_time', 'asc')));
      break;
    }
    case 'UPDATE_TRADE': {
      setState(
        state
          .map((record) => {
            if (record.id === action.payload.id) {
              return action.payload;
            }
            return record;
          })
          .sort(sortRecords('event_time', 'asc')),
      );
      break;
    }
    case 'DELETE_TRADE': {
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
export { dispatch };
