import { APIService } from '@/shared/backend/api/index.service.ts';
import { IBalances } from '../../exchange/index.service.ts';
import { IBalanceService } from '@/shared/backend/position/balance/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Balance Service Factory
 * Generates the object in charge of retrieving and syncing the account's balances for both, the
 * base and quote assets.
 * @returns IBalanceService
 */
const balanceServiceFactory = (): IBalanceService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves the balances object from the local state.
   * @returns Promise<IBalances>
   * @throws
   * - 12500: if the HTTP response code is not in the acceptedCodes
   * - 13503: if the response didn't include a valid object (binance)
   * - 13504: if the response didn't include a valid list of balances (binance)
   * - 13750: if the balance for the base asset is not in the response object (binance)
   * - 13751: if the balance for the quote asset is not in the response object (binance)
   */
  const getBalances = (): Promise<IBalances> => APIService.request(
    'GET',
    'position/balances',
    undefined,
    true,
  ) as Promise<IBalances>;





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    getBalances,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const BalanceService = balanceServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  BalanceService,

  // types
};
