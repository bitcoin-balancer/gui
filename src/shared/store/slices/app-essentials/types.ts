import { IVersion } from '@/shared/backend/version/index.service.ts';
import { IUser } from '@/shared/backend/auth/user/index.service.ts';
import { IAppEssentials, ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * App Essentials Slice
 * Slice in charge of managing the state of the app essentials.
 */
type IAppEssentialsSlice = {
  // the server's current time in ms
  serverTime: number | undefined;

  // the current version of the platform
  version: IVersion | undefined;

  // the number of unread errors
  unreadAPIErrors: number | undefined;

  // the object of the user who is currently logged in
  user: IUser | undefined;

  // the current state of the market
  // ...

  // the active position record (if any)
  // ...

  // the slice's controller
  setAppEssentials: (payload: IAppEssentials | ICompactAppEssentials) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IAppEssentialsSlice,
};
