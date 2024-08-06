import { APIService } from '@/shared/backend/api/index.service.ts';
import { IServerService, IAlarmsConfiguration, IServerState } from '@/shared/backend/server/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Server Service Factory
 * Generates the object in charge of monitoring the temperature|load|usage of the hardware
 * components.
 * @returns IServerService
 */
const serverServiceFactory = (): IServerService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                            STATE                                             *
   ********************************************************************************************** */

  /**
   * Retrieves the current state of the server.
   * @returns Promise<IServerState>
   */
  const getState = (): Promise<IServerState> => APIService.request(
    'GET',
    'server',
    undefined,
    true,
  ) as Promise<IServerState>;





  /* **********************************************************************************************
   *                                     ALARMS CONFIGURATION                                     *
   ********************************************************************************************** */

  /**
   * Retrieves the server alarms' configuration.
   * @returns Promise<IAlarmsConfiguration>
   */
  const getAlarms = (): Promise<IAlarmsConfiguration> => APIService.request(
    'GET',
    'server/alarms',
    undefined,
    true,
  ) as Promise<IAlarmsConfiguration>;

  /**
   * Validates and updates the alarms' configuration.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 8250: if the configuration is not a valid object
   * - 8251: if the maxFileSystemUsage is invalid
   * - 8252: if the maxMemoryUsage is invalid
   * - 8253: if the maxCPULoad is invalid
   */
  const updateAlarms = (newConfig: IAlarmsConfiguration, otpToken: string): Promise<void> => (
    APIService.request(
      'PUT',
      'server/alarms',
      { newConfig },
      true,
      otpToken,
    ) as Promise<void>
  );





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // state
    getState,

    // alarms configuration
    getAlarms,
    updateAlarms,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ServerService = serverServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  ServerService,

  // types
  type IServerState,
  type IAlarmsConfiguration,
};
