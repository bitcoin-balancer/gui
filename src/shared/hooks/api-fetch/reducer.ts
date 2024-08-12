/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable no-console */
import { IAction } from '@/shared/hooks/api-fetch/types.ts';



/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const reducer = <T>(state: T | T[], action: IAction<T>): T | T[] => {
  switch (action.type) {
    /**
     * INITIAL_DATA
     * Fired when the data is initially loaded. The state goes from undefined to T.
     */
    case 'INITIAL_DATA':
      return action.data;


    /**
     * MORE_DATA
     * Fired when the data is a list of records and the user clicks on "Load more".
     */
    case 'MORE_DATA':
      // prioritize the sortFunc if it was provided
      if (typeof action.sortFunc === 'function') {
        return [...state as any[], action.data].sort(action.sortFunc);
      }

      // otherwise, append or prepend the data
      return action.appendNextRecords
        ? [...state as T[], ...action.data]
        : [...action.data, ...state as T[]];





    /**
     * REFETCHED_DATA
     * ...
     */
    case 'REFETCHED_DATA':
      // handle an array type based on the config
      if (Array.isArray(action.data)) {
        // ...
      }

      // otherwise, update the state as is
      return action.data;

    // invalid action type
    default:
      console.error(action, state);
      throw new Error('The action is not supported by the useAPIFetch\'s reducer.');
  }
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  reducer,
};
