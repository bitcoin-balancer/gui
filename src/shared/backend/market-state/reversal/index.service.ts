import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  IReversalService,
  IPriceCrashStateRecord,
  IReversalState,
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
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves a list of price crash state records.
   * @param limit
   * @param startAtEventTime
   * @returns Promise<IPriceCrashStateRecord[]>
   * @throws
   * - 24510: if the desired number of records exceeds the limit
   * - 24511: if the startAtEventTime was provided and is invalid
   */
  const listRecords = (
    limit: number,
    startAtEventTime?: number,
  ): Promise<IPriceCrashStateRecord[]> => {
    let urlPath: string = `market-state/reversal/records?limit=${limit}`;
    if (typeof startAtEventTime === 'number') {
      urlPath += `&startAtEventTime=${startAtEventTime}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    ) as Promise<IPriceCrashStateRecord[]>;
  };





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
   * - 24503: if the points requirement is invalid
   * - 24504: if the weights property is an invalid object
   * - 24505: if the liquidity weight is invalid
   * - 24506: if the coins quote weight is invalid
   * - 24507: if the coins base weight is invalid
   * - 24508: if adding the weights doesn't result in 100
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
   *                                           HELPERS                                            *
   ********************************************************************************************** */

  /**
   * Returns the badge color for the reversal points based on the sum.
   * @param points
   * @returns string
   */
  const getBadgeBGColor = (points: number): string => {
    if (points >= 70) {
      return 'bg-increase-2';
    }
    if (points >= 60) {
      return 'bg-increase-1';
    }
    return 'bg-increase-0';
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    listRecords,

    // configuration
    getConfig,
    updateConfig,

    // helpers
    getBadgeBGColor,
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
  type IPriceCrashStateRecord,
  type IReversalState,
  type IReversalPointWeights,
  type IReversalConfig,
};
