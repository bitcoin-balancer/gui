import { IState, ISplitStateID, ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';
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
 *                                             TYPES                                              *
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
 *                                         GUI SPECIFIC                                           *
 ************************************************************************************************ */

/**
 * State Names
 * The readable names given to each supported state. For example: 'Increasing', 'Decreasing', etc...
 */
type IStateNames = {
  [key in IState]: string
};

/**
 * Split Names
 * The names of the splits. For example: 's100' -> '100%'
 */
type ISplitNames = {
  [key in ISplitStateID]: string;
};

/**
 * Split Values
 * The numeric value used to apply a split to a sequence of values.
 */
type ISplitValues = {
  [key in ISplitStateID]: number;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IMarketStateService,

  // types
  IMarketState,

  // gui specific
  IStateNames,
  ISplitNames,
  ISplitValues,
};
