

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Reversal Service
 * Object in charge of evaluating if a price crash has the potential to reverse.
 */
type IReversalService = {
  // properties
  // ...

  // retrievers
  // ...

  // configuration
  getConfig: () => Promise<IReversalConfig>;
  updateConfig: (newConfig: IReversalConfig, otpToken: string) => Promise<void>;
};





/* ************************************************************************************************
 *                                             STATE                                              *
 ************************************************************************************************ */

/**
 * Price Crash State Record
 * The record originated when the base asset's price experiences a sharp decline. Once the time
 * runs out (set by crashDuration), the record is stored in the database.
 */
type IPriceCrashStateRecord = {
  // the identifier of the record
  id: string;

  // the highest number of points accumulated throughout the price crash state
  highest_points: number;

  // the number of points accumulated when the price crash state ended
  final_points: number;

  // the timestamp (in ms) when the price crash state was activated
  event_time: number;

  // the timestamp (in ms) when the reversal event was issued (if any)
  reversal_event_time: number | null;
};

/**
 * Reversal State
 * The object containing the state of the reversal. If a price crash state is not active, this value
 * will be undefined.
 */
type IReversalState = {
  // the identifier of the price crash state record
  id: string;

  // the current number of points
  points: number;

  // the timestamp (in ms) when the reversal event was issued (if any)
  reversalEventTime: number | null;
};





/* ************************************************************************************************
 *                                         CONFIGURATION                                          *
 ************************************************************************************************ */

/**
 * Reversal Point Weights
 * The object that indicates the "importance" of each module. It is used to calculate the likelihood
 * of a price reversal taking place. Keep in mind the sum of these properties must be equals to 100.
 */
type IReversalPointWeights = {
  // the max. number of points that can be obtained via the liquidity module
  liquidity: number;

  // the max. number of points that can be obtained via the coins module (COINS/USDT)
  coinsQuote: number;

  // the max. number of points that can be obtained via the coins module (COINS/BTC)
  coinsBase: number;
};

/**
 * Reversal Config
 * The object containing the configuration that will be used to detect and manage the crash state.
 * It is also used to evaluate the likelihood of the price reversing.
 */
type IReversalConfig = {
  // the number of minutes the price crash state will be active for. Once the time runs out, the
  // record is stored in the database and the state is reset.
  crashDuration: number;

  // the number of minutes Balancer will wait before being able to activate the price crash state
  // again
  crashIdleDuration: number;

  // the total number of points required for a reversal event to be issued
  pointsRequirement: number;

  // the weights by module used to calculate the points
  weights: IReversalPointWeights;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IReversalService,

  // state
  IPriceCrashStateRecord,
  IReversalState,

  // configuration
  IReversalPointWeights,
  IReversalConfig,
};
