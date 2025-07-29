import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  IStrategyService,
  IIncreaseIdleMode,
  IDecreaseLevelID,
  IDecreaseLevel,
  IDecreaseLevels,
  IStrategy,
} from '@/shared/backend/position/strategy/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Strategy Service Factory
 * Generates the object in charge of managing the configuration that will be used to manage
 * positions.
 * @returns IStrategyService
 */
const strategyServiceFactory = (): IStrategyService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                            HELPERS                                           *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the strategy.
   * @returns Promise<IStrategy>
   */
  const getConfig = (): Promise<IStrategy> =>
    APIService.request('GET', 'position/strategy', undefined, true);

  /**
   * Validates and updates the strategy.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 31500: if the config is not a valid object
   * - 31501: if the canIncrease property is not a boolean
   * - 31502: if the canDecrease property is not a boolean
   * - 31503: if the increaseAmountQuote property is not a valid number
   * - 31505: if the increaseIdleDuration property is not a valid number
   * - 31506: if the increaseGainRequirement property is not a valid number
   * - 31507: if the decreaseLevels property is not a valid tuple
   * - 31508: if any of the price levels' gainRequirement property is invalid
   * - 31509: if any of the price levels' percentage property is invalid
   * - 31510: if any of the price levels' frequency property is invalid
   * - 31511: if the increaseIdleMode property is not supported
   */
  const updateConfig = (newConfig: IStrategy, otpToken: string): Promise<void> =>
    APIService.request('PUT', 'position/strategy', { newConfig }, true, otpToken);

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    // ...

    // configuration
    getConfig,
    updateConfig,
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const StrategyService = strategyServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  StrategyService,

  // types
  type IIncreaseIdleMode,
  type IDecreaseLevelID,
  type IDecreaseLevel,
  type IDecreaseLevels,
  type IStrategy,
};
