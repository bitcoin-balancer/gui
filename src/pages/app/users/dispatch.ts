import { sortRecords } from '../../../shared/services/utils/index.service.ts';
import { IUser } from '../../../shared/backend/auth/user/index.service.ts';
import { IAction } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dispatches an action and updates the state so it is in sync with the backend.
 * @param action
 * @param state
 * @param setState
 */
const dispatch = (action: IAction, state: IUser[], setState: (state: IUser[]) => void) => {
  switch (action.type) {
    case 'ADD_USER': {
      const newUsers = [...state, action.payload].sort(sortRecords('authority', 'desc'));
      setState(newUsers);
      break;
    }
    case 'UPDATE_NICKNAME': {
      setState(state.map((user) => {
        if (user.uid === action.payload.uid) {
          return { ...user, nickname: action.payload.newNickname };
        }
        return user;
      }));
      break;
    }
    case 'UPDATE_AUTHORITY': {
      const newUsers = state.map((user) => {
        if (user.uid === action.payload.uid) {
          return { ...user, authority: action.payload.newAuthority };
        }
        return user;
      }).sort(sortRecords('authority', 'desc'));
      setState(newUsers);
      break;
    }
    case 'UPDATE_OTP_SECRET': {
      // nothing changes
      break;
    }
    case 'DELETE_USER': {
      setState(state.filter((user) => user.uid !== action.payload));
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
