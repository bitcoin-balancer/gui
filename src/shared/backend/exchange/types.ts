

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

/**
 * Candlestick Interval
 * The duration of each candlestick period (supported by all exchanges).
 */
type ICandlestickInterval =
'1m' | '5m' | '15m' | '30m' | // minutes
'1h' | // hours
'1d' | // days
'1w'; // weeks





/* ************************************************************************************************
 *                                          ACCOUNT DATA                                          *
 ************************************************************************************************ */

/**
 * Balances
 * The object containing the available balance for the base and quote assets.
 */
type IBalances = {
  [K in IBaseAsset]: number;
} & {
  [K in IQuoteAsset]?: number;
} & {
  // the timestamp in ms of the last time the balances were fetched
  refetchTime: number;
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
  ICandlestickInterval,

  // account data
  IBalances,
};
