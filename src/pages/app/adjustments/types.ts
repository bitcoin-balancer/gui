

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// each item represents a form for a module that can be tuned
type IFormID = 'WINDOW' | 'LIQUIDITY' | 'COINS' | 'REVERSAL' | 'TRADING_STRATEGY' | 'SERVER_ALARMS';
type IFormItem = {
  id: IFormID;
  title: string;
  description: string;
  icon: JSX.Element;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IFormID,
  IFormItem,
};
