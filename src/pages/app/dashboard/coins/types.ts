import {
  ICoinsStates,
  ICompactCoinState,
} from '@/shared/backend/market-state/coins/index.service.ts';
import { ISplitStatesDialogData } from '../split-states-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the current state of the coins
  coinsStates: ICoinsStates<ICompactCoinState>;

  // the function that opens the split states dialog when invoked
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IComponentProps };
