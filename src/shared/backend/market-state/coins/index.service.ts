import { APIService } from '../../api/index.service.ts';
import { ICoinsService, ICoinsConfig } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins Service Factory
 * Generates the object in charge of keeping Balancer in sync with the state of the top coins.
 * @returns ICoinsService
 */
const coinsServiceFactory = (): ICoinsService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the configuration object for the Coins Module.
   * @returns Promise<ICoinsConfig>
   */
  const getConfig = (): Promise<ICoinsConfig> => APIService.request(
    'GET',
    'market-state/coins/config',
    undefined,
    true,
  ) as Promise<ICoinsConfig>;

  /**
   * Validates and updates the coins module's configuration.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 23500: if the config isn't a valid object
   * - 23501: if the window size is invalid
   * - 23502: if the interval is invalid
   * - 23503: if the state requirement is invalid
   * - 23504: if the strong state requirement is invalid
   * - 23505: if the whitelisted symbols is an invalid array
   * - 23506: if any of the whitelisted symbols is invalid
   */
  const updateConfig = (newConfig: ICoinsConfig, otpToken: string): Promise<void> => (
    APIService.request(
      'PUT',
      'market-state/coins/config',
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
    updateConfig,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const CoinsService = coinsServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  CoinsService,

  // types
  // type ICoinsState,
  type ICoinsConfig,
};
