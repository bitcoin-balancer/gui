

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Main Navigation Item
 * The object needed to build the main navigation buttons.
 */
type IMainNavigationItemName = 'Dashboard' | 'Positions' | 'Server' | 'Adjustments';
type IMainNavigationItem = {
  active: boolean;
  name: IMainNavigationItemName;
  path: string;
  icon: JSX.Element;
  badge?: string;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IMainNavigationItem,
};
