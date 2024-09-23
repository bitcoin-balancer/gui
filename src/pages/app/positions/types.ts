

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

// the date range identifiers
type IDateRangeID = '1m' | '3m' | '6m' | '1y' | '2y' | '3y' | '4y' | '5y';

// the object used to build the date range menu
type IDateRange = {
  id: IDateRangeID;
  label: string;
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IDateRangeID,
  IDateRange,
};