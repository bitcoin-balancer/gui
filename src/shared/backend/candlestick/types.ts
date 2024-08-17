

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Candlestick Service
 * Object in charge of providing utility functions to manage candlestic bars.
 */
type ICandlestickService = {
  // properties
  // ...
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Candlestick Record
 * The Kline object containing historical values in OHLC format.
 */
type ICandlestickRecord = {
  // open time (ms) - e.g. 1638122400000
  id: number;

  // open value - e.g. 53896.36
  open: number;

  // high value - e.g. 54186.17
  high: number;

  // low value - e.g. 53256.64
  low: number;

  // close value - e.g. 54108.99
  close: number;
};

/**
 * Compact Candlestick Records
 * The object containing a compact representation of a series of candlesticks.
 */
type ICompactCandlestickRecords = {
  id: number[];
  open: number[];
  high: number[];
  low: number[];
  close: number[];
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  ICandlestickService,

  // candlestick
  ICandlestickRecord,
  ICompactCandlestickRecords,
};
