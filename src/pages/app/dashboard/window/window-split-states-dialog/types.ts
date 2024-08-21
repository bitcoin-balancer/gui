import { ISplitStateID } from '@/shared/backend/market-state/index.service.ts';
import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Data
 * ...
 */
type IWindowStateDialogData = {
  activeID: ISplitStateID;
  windowState: IWindowState;
};

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // open state of the dialog
  // isOpen: boolean;
  // setIsOpen: (isOpen: boolean) => void;

  // the current state of the window
  data: IWindowStateDialogData;

  // the func to close the dialog
  closeDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IWindowStateDialogData,
  IComponentProps,
};
