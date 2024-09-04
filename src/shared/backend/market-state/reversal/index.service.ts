import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  IReversalService,
  IReversalPointWeights,
  IReversalConfig,
} from '@/shared/backend/market-state/reversal/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Reversal Service Factory
 * Generates the object in charge of evaluating if a price crash has the potential to reverse.
 * @returns IReversalService
 */
const reversalServiceFactory = (): IReversalService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           RETRIEVER                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                         CONFIGURATION                                        *
   ********************************************************************************************** */

  /**
   * Retrieves the configuration object for the Reversal Module.
   * @returns Promise<IReversalConfig>
   */
  const getConfig = (): Promise<IReversalConfig> => APIService.request(
    'GET',
    'market-state/reversal/config',
    undefined,
    true,
  ) as Promise<IReversalConfig>;

  /**
   * Validates and updates the reversal's configuration.
   * @param newConfig
   * @returns Promise<void>
   * @throws
   * - 24500: if the new config is an invalid object
   * - 24501: if the crash duration is invalid
   * - 24502: if the crash idle duration is invalid
   * - 24503: if the points requirement is invalid
   * - 24504: if the weights property is an invalid object
   * - 24505: if the liquidity weight is invalid
   * - 24506: if the coins quote weight is invalid
   * - 24507: if the coins base weight is invalid
   */
  const updateConfig = (newConfig: IReversalConfig, otpToken: string): Promise<void> => (
    APIService.request(
      'PUT',
      'market-state/reversal/config',
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

    // retrievers
    // ...

    // configuration
    getConfig,
    updateConfig,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ReversalService = reversalServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  ReversalService,

  // types
  type IReversalPointWeights,
  type IReversalConfig,
};
