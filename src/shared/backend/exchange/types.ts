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
 * Side
 * The kind of action executed by the account.
 * BUY stands for buying the base asset (e.g. USDT -> BTC)
 * SELL stands for selling the base asset (e.g. BTC -> USDT)
 */
type ISide = 'BUY' | 'SELL';

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
  | '1m'
  | '5m'
  | '15m'
  | '30m' // minutes
  | '1h' // hours
  | '1d' // days
  | '1w'; // weeks

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

/**
 * Trade
 * The object containing all the details for a single trade execution.
 */
type ITrade = {
  // the identifier of the trade (assigned by Balancer)
  id?: number;

  // the identifier of the trade in the exchange
  id_alt?: string | null;

  // the timestamp (ms) at which the trade was executed
  event_time: number;

  // if this property is set it means the trade was created manually through the GUI
  notes?: string | null;

  // the kind of action that was executed
  side: ISide;

  // the rate of the trade in quote asset
  price: number;

  // the total amount in base asset
  amount: number;

  // the total amount in quote asset
  amount_quote: number;

  // the total comission charged in base or quote asset (whichever asset was received)
  comission: number;
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
  ISide,
  IExchangeID,
  IExchangeConfig,
  ICandlestickInterval,

  // account data
  IBalances,
  ITrade,
};
