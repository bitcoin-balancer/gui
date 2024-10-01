import {
  ISide,
  IExchangeID,
  IExchangeService,
  IExchangeConfig,
  ICandlestickInterval,
  IBalances,
  ITrade,
} from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Exchange Service Factory
 * Generates the object in charge of brokering the communication with the Exchanges' APIs.
 * @returns IExchangeService
 */
const exchangeServiceFactory = (): IExchangeService => {
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

    someAction,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ExchangeService = exchangeServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  ExchangeService,

  // types
  type ISide,
  type IExchangeID,
  type IExchangeConfig,
  type ICandlestickInterval,
  type IBalances,
  type ITrade,
};
