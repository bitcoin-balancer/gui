import { ISplitStateID, ISplitStateResult } from '@/shared/backend/market-state/shared/types.ts';
import { ISplitStatesDialogData } from '../split-states-dialog/index.component.tsx';
import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';

/* ************************************************************************************************
 *                                            WINDOW                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the current state of the window
  windowState: IWindowState;

  // the function that opens the split states dialog when invoked
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void;
};



/* ************************************************************************************************
 *                                       SPLIT TILE BUTTON                                        *
 ************************************************************************************************ */

/**
 * Split Tile Button Props
 * ...
 */
type ISplitTileButtonProps = {
  id: ISplitStateID;
  split: ISplitStateResult;
  displayWindowDialog: (id: ISplitStateID) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // window
  IComponentProps,

  // split tile button
  ISplitTileButtonProps,
};
