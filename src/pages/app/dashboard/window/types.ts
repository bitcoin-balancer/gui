import { ISplitStateID, ISplitStateResult } from '@/shared/backend/market-state/shared/types.ts';
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
  windowState: IWindowState
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
