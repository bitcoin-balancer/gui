import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';
import { IPositionState } from '@/shared/backend/position/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  windowState: IWindowState;
  positionState: IPositionState;
  className?: string;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
