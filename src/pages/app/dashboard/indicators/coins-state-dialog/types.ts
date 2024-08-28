import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';

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

  // the func to close the dialog
  closeDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
