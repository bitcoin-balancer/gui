import { IAuthority } from '@/shared/backend/auth/user/index.service.ts';

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
  requirement: IAuthority;
  badge?: string;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IMainNavigationItem,
};
