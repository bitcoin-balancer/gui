import { IRange } from '@/shared/types.ts';
import { APIService } from '@/shared/backend/api/index.service.ts';
import { IStrategyService, IStrategy } from '@/shared/backend/position/strategy/types.ts';

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

  // the range sizes that will be used to calculate the min. position amount lower and upper bands
  const __MIN_POSITION_AMOUNT_RANGE_SIZE: IRange = {
    min: 0.15,
    max: 0.65,
  };





  /* **********************************************************************************************
   *                                            HELPERS                                           *
   ********************************************************************************************** */

  /**
   * Calculates the amount range that can be used to set the min position amount in the quote asset.
   * @param increaseAmountQuote
   * @returns IRange
   */
  const calculateMinPositionAmountQuoteRange = (increaseAmountQuote: number): IRange => ({
    min: Math.floor(increaseAmountQuote * __MIN_POSITION_AMOUNT_RANGE_SIZE.min),
    max: Math.floor(increaseAmountQuote * __MIN_POSITION_AMOUNT_RANGE_SIZE.max),
  });





  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the strategy.
   * @returns Promise<IStrategy>
   */
  const getConfig = (): Promise<IStrategy> => APIService.request(
    'GET',
    'position/strategy',
    undefined,
    true,
  ) as Promise<IStrategy>;

  /**
   * Validates and updates the strategy.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 31500: if the config is not a valid object
   * - 31501: if the canIncrease property is not a boolean
   * - 31502: if the canDecrease property is not a boolean
   * - 31503: if the increaseAmountQuote property is not a valid number
   * - 31504: if the minPositionAmountQuote property is not a valid number
   * - 31505: if the increaseIdleDuration property is not a valid number
   * - 31506: if the increaseGainRequirement property is not a valid number
   * - 31507: if the decreaseLevels property is not a valid tuple
   * - 31508: if any of the price levels' gainRequirement property is invalid
   * - 31509: if any of the price levels' percentage property is invalid
   * - 31510: if any of the price levels' frequency property is invalid
   */
  const updateConfig = (newConfig: IStrategy, otpToken: string): Promise<void> => (
    APIService.request(
      'PUT',
      'position/strategy',
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

    // helpers
    calculateMinPositionAmountQuoteRange,

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
  type IStrategy,
};
