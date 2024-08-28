import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';
import { ISplitStatesDialogData } from '../../split-states-dialog/index.component.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the asset used to pair the coins
  asset: ICoinStateAsset;

  // the function that opens the split states dialog when invoked
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void;

  // the func to close the dialog
  closeDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
