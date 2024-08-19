import { IState } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the current state of the window
  state: IState;

  // the list of classes that will be appended (if any)
  className?: string;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
