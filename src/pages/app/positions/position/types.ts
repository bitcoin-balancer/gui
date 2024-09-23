import { IPosition } from '@/shared/backend/position/index.service.ts';

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
  position: IPosition;
  setSidenavOpen: (value: boolean) => void;
  refetchPosition: () => Promise<void>;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IPageName,
  INavItem,
  IPositionComponentProps,
};
