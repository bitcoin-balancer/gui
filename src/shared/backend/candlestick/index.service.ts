import { ICandlestickService, ICompactCandlestickRecords } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Candlestick Service Factory
 * Generates the object in charge of providing utility functions to manage candlestic bars.
 * @returns ICandlestickService
 */
const candlestickServiceFactory = (): ICandlestickService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           HELPERS                                            *
   ********************************************************************************************** */

  /**
   * Syncs the compact candlestick records based on the new data.
   * @param oldVal
   * @param newVal
   * @returns ICompactCandlestickRecords
   */
  const syncRecords = (
    oldVal: ICompactCandlestickRecords,
    newVal: ICompactCandlestickRecords,
  ): ICompactCandlestickRecords => {
    // init the new records
    const val: ICompactCandlestickRecords = {
      id: [...oldVal.id],
      open: [...oldVal.open],
      high: [...oldVal.high],
      low: [...oldVal.low],
      close: [...oldVal.close],
    };

    // if a new candlestick came into existance, update the last local value and append the new one
    // otherwise, just update the mutable properties from the last one
    if (val.id[val.id.length - 1] !== newVal.id[newVal.id.length - 1]) {
      // drop the oldest candlestick
      val.id.shift();
      val.open.shift();
      val.high.shift();
      val.low.shift();
      val.close.shift();

      // update the last existing candlestick
      val.high[val.id.length - 1] = newVal.high[newVal.id.length - 2];
      val.low[val.id.length - 1] = newVal.low[newVal.id.length - 2];
      val.close[val.id.length - 1] = newVal.close[newVal.id.length - 2];

      // add the new one
      val.id.push(newVal.id[newVal.id.length - 1]);
      val.open.push(newVal.open[newVal.id.length - 1]);
      val.high.push(newVal.high[newVal.id.length - 1]);
      val.low.push(newVal.low[newVal.id.length - 1]);
      val.close.push(newVal.close[newVal.id.length - 1]);
    } else {
      val.high[val.id.length - 1] = newVal.high[newVal.id.length - 1];
      val.low[val.id.length - 1] = newVal.low[newVal.id.length - 1];
      val.close[val.id.length - 1] = newVal.close[newVal.id.length - 1];
    }

    // finally, return the synced records
    return val;
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    syncRecords,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const CandlestickService = candlestickServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  CandlestickService,

  // types
  type ICompactCandlestickRecords,
};
