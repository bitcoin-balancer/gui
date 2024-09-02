import { IMarketState } from '@/shared/backend/market-state/index.service.ts';
import { ISplitStatesDialogData } from '../split-states-dialog/index.component.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Dialog ID
 * The identifier of all supported lazy dialogs within the indicators component.
 */
type IDialogID = 'liquidity' | 'coins' | 'reversal_list' | 'reversal';

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
  IDialogID,
  IComponentProps,
};
