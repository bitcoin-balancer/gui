import { IState, ISplitStateID } from '@/shared/backend/market-state/shared/types.ts';
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

  // ...
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
 * ...
 */
type IStateNames = {
  [key in IState]: string
};

/**
 * Split Names
 * ...
 */
type ISplitNames = {
  [key in ISplitStateID]: string;
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
};
