import { IBalances } from '@/shared/backend/exchange/index.service.ts';

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Balance Service
 * Object in charge of retrieving and syncing the account's balances for both, the base and quote
 * assets.
 */
type IBalanceService = {
  // properties
  // ...

  // retrievers
  getBalances: () => Promise<IBalances>;
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// ...



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IBalanceService,

  // types
};