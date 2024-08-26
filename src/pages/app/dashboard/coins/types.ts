import { ICoinsStates, ICompactCoinState } from '@/shared/backend/market-state/coins/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */



/**
 * Component Props
 * ...
 */
type IComponentProps = {
  coinsStates: ICoinsStates<ICompactCoinState>;
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
