import { APIService } from '@/shared/backend/api/index.service.ts';
import { INotificationService, INotification } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Notification Service Factory
 * Generates the object in charge of broadcasting notifications through the Telegram Group.
 * @returns INotificationService
 */
const notificationServiceFactory = (): INotificationService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           ACTIONS                                            *
   ********************************************************************************************** */

  /**
   * Retrieves a series of records. If the startAtID is provided, it will start at that point
   * exclusively.
   * @param limit
   * @param startAtID?
   * @returns Promise<INotification[]>
   * @throws
   * - 10500: if the startAtID was provided and is not a valid identifier
   * - 10501: if the query limit is larger than the limit
   */
  const list = (
    limit: number,
    startAtID?: number,
  ): Promise<INotification[]> => {
    let urlPath: string = `notification?limit=${limit}`;
    if (typeof startAtID === 'number') {
      urlPath += `&startAtID=${startAtID}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    );
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    list,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const NotificationService = notificationServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  NotificationService,

  // types
  type INotification,
};
