import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';
import {
  ISplitStateID,
  ISplitStateItem,
  ISplitStates,
  IState,
} from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Module ID
 * The identifier of the module that displayed the dialog.
 */
type IModuleID = 'WINDOW' | 'COINS';

/**
 * Module State
 * The format in which the state must be passed to the component.
 */
type IModuleState = {
  // the state of the window
  state: IState;

  // the state result for each split
  splitStates: ISplitStates;

  // the price items that comprise the window
  window: ISplitStateItem[];
};

/**
 * Split States Dialog Data
 * The data needed for the dialog to render correctly.
 */
type ISplitStatesDialogData = {
  // the identifier of the module
  moduleID: IModuleID;

  // the current state of the module
  moduleState: IModuleState;

  // the split that will be activated on load. Defaults to s100
  activeID?: ISplitStateID;

  // present when moduleID === 'COINS'
  asset?: ICoinStateAsset;
  symbol?: string;
};

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the data object passed to open the dialog
  data: ISplitStatesDialogData;

  // the func to close the dialog
  closeDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IModuleID,
  ISplitStatesDialogData,
  IComponentProps,
};
