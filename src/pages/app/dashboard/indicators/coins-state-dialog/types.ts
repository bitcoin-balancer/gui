import {
  ICoinsState,
  ICoinStateAsset,
  ISemiCompactCoinState,
} from '@/shared/backend/market-state/coins/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Coins State Dialog Data
 * The data needed for the dialog to render correctly.
 */
type ICoinsStateDialogData = {
  // the asset used to pair the coins
  asset: ICoinStateAsset;

  // the current state of the module
  moduleState: ICoinsState<ISemiCompactCoinState>;
};

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the data object passed to open the dialog
  data: ICoinsStateDialogData;

  // the func to close the dialog
  closeDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  ICoinsStateDialogData,
  IComponentProps,
};
