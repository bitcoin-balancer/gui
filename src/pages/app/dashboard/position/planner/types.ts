import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';
import { IIncreasePlan } from '@/shared/backend/position/planner/index.service.ts';
import { IPositionState } from '@/shared/backend/position/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * The props of be used by the base component.
 */
type IComponentProps = {
  windowState: IWindowState;
  positionState: IPositionState;
  className?: string;
};


/**
 * Component Props
 * The props of be used by the increase plan component.
 */
type IIncreasePlanComponentProps = {
  windowState: IWindowState;
  plan: IIncreasePlan;
  closeDialog: (nextState: undefined) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
  IIncreasePlanComponentProps,
};
