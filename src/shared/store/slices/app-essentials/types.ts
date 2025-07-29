import { IAppEssentials, ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * App Essentials Slice
 * Slice in charge of managing the state of the app essentials.
 */
type IAppEssentialsSlice = Partial<IAppEssentials> & {
  // the slice's controller
  setAppEssentials: (payload: IAppEssentials | ICompactAppEssentials) => void;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IAppEssentialsSlice };
