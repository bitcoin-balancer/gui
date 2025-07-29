import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  ILiquidityService,
  ILiquidityPriceLevel,
  ILiquiditySideID,
  ILiquiditySide,
  ILiquidityIntensity,
  ILiquidityState,
  ICompactLiquidityState,
  ILiquidityConfig,
} from '@/shared/backend/market-state/liquidity/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity Service Factory
 * Generates the object in charge of keeping Balancer in sync with the base asset's order book and
 * calculating its state.
 * @returns ILiquidityService
 */
const liquidityServiceFactory = (): ILiquidityService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                           RETRIEVER                                          *
   ********************************************************************************************** */

  /**
   * Retrieves the up-to-date liquidity state.
   * @returns Promise<ILiquidityState>
   */
  const getState = (): Promise<ILiquidityState> =>
    APIService.request('GET', 'market-state/liquidity/state', undefined, true);

  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the configuration object for the Liquidity Module.
   * @returns Promise<ILiquidityConfig>
   */
  const getConfig = (): Promise<ILiquidityConfig> =>
    APIService.request('GET', 'market-state/liquidity/config', undefined, true);

  /**
   * Validates and updates the liquidity's configuration.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 22500: if the new config is not a valid object
   * - 22501: if the max distance from price is invalid
   * - 22502: if the intensity weights is not a valid object
   * - 22503: if any of the intensity weights is invalid
   */
  const updateConfig = (newConfig: ILiquidityConfig, otpToken: string): Promise<void> =>
    APIService.request('PUT', 'market-state/liquidity/config', { newConfig }, true, otpToken);

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retriever
    getState,

    // configuration
    getConfig,
    updateConfig,
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const LiquidityService = liquidityServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  LiquidityService,

  // types
  type ILiquidityPriceLevel,
  type ILiquiditySideID,
  type ILiquiditySide,
  type ILiquidityIntensity,
  type ILiquidityState,
  type ICompactLiquidityState,
  type ILiquidityConfig,
};
