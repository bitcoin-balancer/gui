import { APIService } from '../../api/index.service.ts';
import { IWindowService, IWindowState, IWindowConfig } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Service Factory
 * Generates the object in charge of keeping Balancer in sync with the market's candlesticks and
 * calculating its state.
 * @returns IWindowService
 */
const windowServiceFactory = (): IWindowService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the configuration object for the Window Module.
   * @returns Promise<IWindowConfig>
   */
  const getConfig = (): Promise<IWindowConfig> => APIService.request(
    'GET',
    'market-state/window/config',
    undefined,
    true,
  ) as Promise<IWindowConfig>;

  /**
   * Validates and updates the window's configuration.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 21500: if the config isn't a valid object
   * - 21501: if the refetch frequency is invalid
   * - 21502: if the requirement is invalid
   * - 21503: if the strong requirement is invalid
   * - 21504: if the requirement is greater than or equals to the strong requirement
   * - 21505: if the size of the window is an invalid integer
   * - 21506: if the interval is not supported
   */
  const updateAlarms = (newConfig: IWindowConfig, otpToken: string): Promise<void> => (
    APIService.request(
      'PUT',
      'market-state/window/config',
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

    // configuration
    getConfig,
    updateAlarms,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const WindowService = windowServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  WindowService,

  // types
  type IWindowState,
  type IWindowConfig,
};
