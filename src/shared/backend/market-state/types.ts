import {
  ISplitNames,
  ISplitStateID,
  ISplitStateItem,
  ISplitValues,
  IStateNames,
} from '@/shared/backend/market-state/shared/types.ts';
import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';


/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Market State Service
 * Object in charge of interacting with the market state module and provide a series of utility
 * functions.
 */
type IMarketStateService = {
  // properties
  STATE_NAMES: IStateNames;
  SPLITS: ISplitStateID[];
  SPLIT_NAMES: ISplitNames;
  SPLIT_VALUES: ISplitValues;

  // helpers
  applySplit: (
    series: number[] | ISplitStateItem[],
    splitID: ISplitStateID,
  ) => number[] | ISplitStateItem[];
};





/* ************************************************************************************************
 *                                          MARKET STATE                                          *
 ************************************************************************************************ */

/**
 * Market State
 * The object containing the up-to-date state for all Market State's submodules.
 */
type IMarketState = {
  // the state of the window module
  windowState: IWindowState;

  // ...
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IMarketStateService,

  // market state
  IMarketState,
};
