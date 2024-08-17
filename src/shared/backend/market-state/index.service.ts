import { IState } from '@/shared/backend/market-state/shared/types.ts';
import { IMarketStateService, IMarketState } from '@/shared/backend/market-state/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Market State Factory
 * Generates the object in charge of interacting with the market state module and provide a series
 * of utility functions.
 * @returns IMarketStateService
 */
const marketStateServiceFactory = (): IMarketStateService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  const someAction = () => {
    // ...
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    someAction,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const MarketStateService = marketStateServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  MarketStateService,

  // types
  type IState,
  type IMarketState,
};
