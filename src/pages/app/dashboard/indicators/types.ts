import { IMarketState } from '@/shared/backend/market-state/index.service.ts';
import { ISplitStatesDialogData } from '../split-states-dialog/index.component.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */



/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the current state of the market
  marketState: IMarketState;

  // the function that opens the split states dialog when invoked
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void;
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
