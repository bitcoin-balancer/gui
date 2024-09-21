

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the names of existing pages
type IPageName = 'general' | 'history' | 'trades' | 'transactions';

// the nav buttons
type INavItem = {
  id: IPageName;
  name: string;
  icon: JSX.Element;
};

// the props for all server components
type IPositionComponentProps = {
  setSidenavOpen: (value: boolean) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPageName,
  INavItem,
  IPositionComponentProps,
};
