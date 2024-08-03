import { APIService } from '../api/index.service.ts';
import { IServerService, IAlarmsConfiguration } from './types.ts';

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
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                     ALARMS CONFIGURATION                                     *
   ********************************************************************************************** */

  /**
   * Retrieves the server alarms' configuration.
   * @returns Promise<IAlarmsConfiguration>
   */
  const getAlarms = () => APIService.request(
    'GET',
    'server/alarms',
    undefined,
    true,
  ) as Promise<IAlarmsConfiguration>;

  /**
   * Validates and updates the alarms' configuration.
   * @param newConfig
   * @throws
   * - 8250: if the configuration is not a valid object
   * - 8251: if the maxFileSystemUsage is invalid
   * - 8252: if the maxMemoryUsage is invalid
   * - 8253: if the maxCPULoad is invalid
   */
  const updateAlarms = (newConfig: IAlarmsConfiguration, otpToken: string) => APIService.request(
    'PUT',
    'server/alarms',
    { newConfig },
    true,
    otpToken,
  ) as Promise<void>;





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

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
  type IAlarmsConfiguration,
};
