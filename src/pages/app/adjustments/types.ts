

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// each item represents a form for a module that can be tuned
type IFormID = 'WINDOW' | 'LIQUIDITY' | 'COINS' | 'REVERSAL' | 'STRATEGY' | 'SERVER_ALARMS';
type IFormItem = {
  id: IFormID;
  title: string;
  description: string;
  icon: JSX.Element;
};

// the props that will be passed to the form dialogs
type IFormProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IFormID,
  IFormItem,
  IFormProps,
};
