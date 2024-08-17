

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Exchange Service
 * Object in charge of brokering the communication with the Exchanges' APIs.
 */
type IExchangeService = {
  // properties
  // ...
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Base Asset
 * Refers to the asset that is the quantity of a symbol. For the symbol BTCUSDT, BTC would be the
 * base asset.
 */
type IBaseAsset = 'BTC';

/**
 * Quote Asset
 * Refers to the asset that is the price of a symbol. For the symbol BTCUSDT, USDT would be the
 * quote asset.
 */
type IQuoteAsset = 'USDT' | 'USDC' | 'DAI' | 'FDUSD' | 'PYUSD' | 'USDD' | 'TUSD';

/**
 * Exchange ID
 * Each exchange is identified by an ID and can be installed in any of the modules.
 */
type IExchangeID = 'binance' | 'bitfinex' | 'coinbase' | 'kraken' | 'okx';

/**
 * Exchanges Configuration
 * The object that determines what exchange is used by which module.
 */
type IExchangeConfig = {
  // the main asset that will be traded (e.g. BTC)
  baseAsset: IBaseAsset;

  // the asset that will be exchanged against the base asset (e.g. USDT)
  quoteAsset: IQuoteAsset;

  // the exchange that will be used in the Market State's Window Module
  window: IExchangeID;

  // the exchange that will be used in the Market State's Liquidity Module
  liquidity: IExchangeID;

  // the exchange that will be used in the Market State's Coins Module
  coins: IExchangeID;

  // the exchange that will be used in the Trading Module
  trading: IExchangeID;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IExchangeService,

  // types
  IBaseAsset,
  IQuoteAsset,
  IExchangeID,
  IExchangeConfig,
};
