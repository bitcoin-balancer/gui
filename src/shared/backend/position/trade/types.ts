import { ISide } from '../../exchange/index.service.ts';

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Trade Service
 * Object in charge of retrieving and storing the account trades triggered by positions.
 */
type ITradeService = {
  // properties
  // ...

  // ...
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Manual Trade
 * The object used to create and update trades that are managed manually.
 */
type IManualTrade = {
  // the timestamp (ms) at which the trade was executed
  event_time: number;

  // the kind of action that was executed
  side: ISide;

  // the reason why a manual trade is being created
  notes: string;

  // the rate of the trade in quote asset
  price: number;

  // the total amount in base asset
  amount: number;
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  ITradeService,

  // types
  IManualTrade,
};
