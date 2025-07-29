import {
  IPlannerService,
  ITargetState,
  IIncreasePlan,
  IDecreasePlan,
  IPositionPlan,
} from '@/shared/backend/position/planner/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Planner Service Factory
 * Generates the object in charge of calculating the plans for increasing and decreasing positions.
 * @returns ITradeService
 */
const plannerServiceFactory = (): IPlannerService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const PlannerService = plannerServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  PlannerService,

  // types
  type ITargetState,
  type IIncreasePlan,
  type IDecreasePlan,
  type IPositionPlan,
};
