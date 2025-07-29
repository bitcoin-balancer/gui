/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the names of existing pages
type IPageName = 'monitoring' | 'api-errors' | 'database';

// the props for all server components
type IServerComponentProps = {
  setSidenavOpen: (value: boolean) => void;
  unreadAPIErrors?: number;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IPageName, IServerComponentProps };
