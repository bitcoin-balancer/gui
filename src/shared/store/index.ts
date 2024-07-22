import { create } from 'zustand';
import {
  createConfirmationDialogSlice,
  IConfirmationDialogSlice,
} from './slices/confirmation-dialog/index.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Store
 * ...
 */
type IStore = IConfirmationDialogSlice;
const useStore = create<IStore>((set, get, api) => ({
  ...createConfirmationDialogSlice(set, get, api),
}));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useStore,
};
