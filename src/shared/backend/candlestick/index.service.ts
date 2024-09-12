import {
  ICandlestickService,
  ICompactCandlestickRecords,
  ICombinedCompactCandlestickRecords,
  IEventHistoryRecord,
} from './types.ts';

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
   * Builds the compact candlestick records object in pristine state.
   * @returns ICompactCandlestickRecords
   */
  const __buildPristineCompactCandlestickRecords = (): ICompactCandlestickRecords => ({
    id: [],
    open: [],
    high: [],
    low: [],
    close: [],
  });

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

  /**
   * Splits a combined records object into individual compact records.
   * @param combinedRecords
   * @returns ICompactCandlestickRecords[]
   */
  const splitRecords = (
    combinedRecords: ICombinedCompactCandlestickRecords,
  ): ICompactCandlestickRecords[] => {
    if (combinedRecords && combinedRecords.id.length) {
      // init the records
      const records: ICompactCandlestickRecords[] = combinedRecords.open[0].map(
        __buildPristineCompactCandlestickRecords,
      );

      // iterate over each identifier and split the data
      combinedRecords.id.forEach((openTime, i) => {
        combinedRecords.open[0].forEach((_openPrice, innerI) => {
          records[innerI].id.push(openTime);
          records[innerI].open.push(combinedRecords.open[i][innerI]);
          records[innerI].high.push(combinedRecords.high[i][innerI]);
          records[innerI].low.push(combinedRecords.low[i][innerI]);
          records[innerI].close.push(combinedRecords.close[i][innerI]);
        });
      });

      // finally, return the split records
      return records;
    }
    return [];
  };



  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // helpers
    syncRecords,
    splitRecords,
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
  type ICombinedCompactCandlestickRecords,
  type IEventHistoryRecord,
};
