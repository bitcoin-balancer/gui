

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Nav Service
 * Object in charge of managing in-app and external navigation.
 */
type INavService = {
  // properties
  // ...

  // external navigation
  openURL:(url: string, newTab?: boolean) => void;
  openGitHubPage:() => void;

  // internal navigation
  landing: () => string;
  signIn: () => string;
  updatePassword: () => string;
  dashboard: () => string;
  positions: () => string;
  server: () => string;
  adjustments: () => string;
  users: () => string;
};




/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// ...





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  INavService,

  // types
  // ...
};
