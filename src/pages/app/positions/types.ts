import { ISplitStateItem, IState } from '@/shared/backend/market-state/shared/types.ts';

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

// the result of processing the positions' data
type IProcessedPositions = {
  // header
  pnlState: IState;
  pnl: string;
  pnlClass: string;
  roiState: IState;
  roi: string;
  roiClass: string;
  investments: string;

  // charts
  pnlChart: ISplitStateItem[];
  roiChart: ISplitStateItem[];
  investmentsChart: ISplitStateItem[];
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IDateRangeID, IDateRange, IProcessedPositions };
