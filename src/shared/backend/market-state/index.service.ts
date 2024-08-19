import { IState, ISplitStateID } from '@/shared/backend/market-state/shared/types.ts';
import {
  IMarketStateService,
  IMarketState,
  IStateNames,
  ISplitNames,
} from '@/shared/backend/market-state/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Market State Factory
 * Generates the object in charge of interacting with the market state module and provide a series
 * of utility functions.
 * @returns IMarketStateService
 */
const marketStateServiceFactory = (): IMarketStateService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // object containing all supported states and their names
  const STATE_NAMES: IStateNames = {
    2: 'Increasing strongly',
    1: 'Increasing',
    0: 'Stateless',
    '-1': 'Decreasing',
    '-2': 'Decreasing strongly',
  };

  // the list of existing splits
  const SPLITS: ISplitStateID[] = ['s100', 's75', 's50', 's25', 's15', 's10', 's5', 's2'];

  // object containing all supported splits and their names
  const SPLIT_NAMES: ISplitNames = {
    s100: '100%',
    s75: '75%',
    s50: '50%',
    s25: '25%',
    s15: '15%',
    s10: '10%',
    s5: '5%',
    s2: '2%',
  };





  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  const someAction = () => {
    // ...
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    STATE_NAMES,
    SPLITS,
    SPLIT_NAMES,

    // actions
    someAction,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const MarketStateService = marketStateServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  MarketStateService,

  // types
  type IState,
  type IMarketState,
};
