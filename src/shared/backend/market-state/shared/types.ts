/* ************************************************************************************************
 *                                             STATE                                              *
 ************************************************************************************************ */

/**
 * State
 * All of the Market State Modules can be stateless or statefull at any given time. The value of the
 * state indicates the directionality of the given module.
 * For example, if the current state of the Window Module is 1, means the price is increasing,
 * whereas a value of -2 would indicate the price is decreasing strongly.
 */
type IState = -2 | -1 | 0 | 1 | 2;

/**
 * State Result
 * The object containing the results of the state calculation.
 */
type IStateResult = {
  // the mean of all of the split states
  mean: IState;

  // the states for each split
  splits: ISplitStates;
};

/* ************************************************************************************************
 *                                         SPLIT STATES                                           *
 ************************************************************************************************ */

/**
 * ID
 * Each split has a unique identifier which indicates the size of the split. For example, s100
 * corresponds to the entire series while s15 only makes use of 15% of the items (most recent).
 */
type ISplitStateID = 's100' | 's75' | 's50' | 's25' | 's15' | 's10' | 's5' | 's2';

/**
 * Item
 * The split states can be calculated based on a series of numeric values or items.
 */
type ISplitStateItem = {
  // the open timestamp in ms of the period
  x: number;

  // the close price of the period
  y: number;
};

/**
 * Result
 * The resulting object when calculating the state for a split.
 */
type ISplitStateResult = {
  // the resulting state for a split
  state: IState;

  // the percentage change experienced in the split
  change: number;
};

/**
 * Split States
 * The object containing the results for each split.
 */
type ISplitStates = {
  [key in ISplitStateID]: ISplitStateResult;
};

/**
 * Compact Split States
 * The object containing a compact representation of the state for each split.
 */
type ICompactSplitStates = {
  [key in ISplitStateID]: IState;
};

/* ************************************************************************************************
 *                                         GUI SPECIFIC                                           *
 ************************************************************************************************ */

/**
 * State Names
 * The readable names given to each supported state. For example: 'Increasing', 'Decreasing', etc...
 */
type IStateNames = {
  [key in IState]: string;
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

/**
 * Split Percentage Changes
 * The prettified string that shows the percentage change experienced in a single split.
 */
type ISplitPercentageChanges = {
  [key in ISplitStateID]: string;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // state
  IState,
  IStateResult,

  // split states
  ISplitStateID,
  ISplitStateItem,
  ISplitStateResult,
  ISplitStates,
  ICompactSplitStates,

  // gui specific
  IStateNames,
  ISplitNames,
  ISplitValues,
  ISplitPercentageChanges,
};
