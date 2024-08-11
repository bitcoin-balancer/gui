import { ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';


/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the type of payload is based on the event name
type ISocketData<T> = T extends 'compact_app_essentials' ? ICompactAppEssentials : never;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  ISocketData,
};
