import { sortRecords } from '../../../shared/services/utils/index.service.ts';
import { IUser } from '../../../shared/backend/auth/user/index.service.ts';
import { IAction } from './types';



const dispatch = (action: IAction, state: IUser[], setState: (state: IUser[]) => void) => {
  switch (action.type) {
    case 'ADD_USER': {
      const newUsers = [...state, action.payload].sort(sortRecords('authority', 'desc'));
      setState(newUsers);
      break;
    }
    case 'DELETE_USER': {
      setState(state.filter((user) => user.uid !== action.payload));
      break;
    }
    default:
      throw new Error(`The action type '${action.type}' is invalid`);
  }
};



export {
  dispatch,
};
