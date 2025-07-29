import { APIService } from '../../api/index.service.ts';
import {
  ICoinsService,
  ICoinStateAsset,
  ICoinState,
  ICoinsState,
  ISemiCompactCoinState,
  ICompactCoinState,
  ICoinsStates,
  ICoinsConfig,
  ICoinsConfigGUI,
} from './types.ts';

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
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves the state object for a coin based on an asset.
   * @param asset
   * @param symbol
   * @returns Promise<ICoinState>
   * @throws
   * - 23508: if the state asset is invalid
   * - 23510: if the symbol is not in the asset's statesBySymbol object
   */
  const getStateForSymbol = (asset: ICoinStateAsset, symbol: string): Promise<ICoinState> =>
    APIService.request('GET', `market-state/coins/state/${asset}/${symbol}`, undefined, true);

  /**
   * Retrieves the semi-compact state for an asset.
   * @param asset
   * @throws
   * - 23508: if the state asset is invalid
   */
  const getSemiCompactStateForAsset = (
    asset: ICoinStateAsset,
  ): Promise<ICoinsState<ISemiCompactCoinState>> =>
    APIService.request('GET', `market-state/coins/state/${asset}`, undefined, true);

  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the configuration object for the Coins Module.
   * @returns Promise<ICoinsConfig>
   */
  const getConfig = (): Promise<ICoinsConfig> =>
    APIService.request('GET', 'market-state/coins/config', undefined, true);

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
   * - 23507: if the limit is invalid
   * - 23509: if the whitelist doesn't include the base asset
   * - 23511: if the requirement is equals or larger than the strongRequirement
   */
  const updateConfig = (newConfig: ICoinsConfig, otpToken: string): Promise<void> =>
    APIService.request('PUT', 'market-state/coins/config', { newConfig }, true, otpToken);

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    getStateForSymbol,
    getSemiCompactStateForAsset,

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
  type ICoinStateAsset,
  type ICoinState,
  type ISemiCompactCoinState,
  type ICompactCoinState,
  type ICoinsState,
  type ICoinsStates,
  type ICoinsConfig,
  type ICoinsConfigGUI,
};
