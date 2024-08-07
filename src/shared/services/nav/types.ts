

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

  // external urls builder
  buildGUICommitURL: (hash: string) => string;
  buildAPICommitURL: (hash: string) => string;

  // external navigation
  openURL:(url: string, newTab?: boolean, noReferrer?: boolean) => void;
  createNewInstance:() => void;
  openGitHubPage:() => void;
  openGUIRepo:() => void;
  openGUICommit: (hash: string) => void;
  openAPIRepo:() => void;
  openAPICommit: (hash: string) => void;

  // internal navigation
  landing: () => string;
  signIn: () => string;
  updatePassword: () => string;
  dashboard: () => string;
  positions: () => string;
  server: () => string;
  adjustments: () => string;
  ipBlacklist: () => string;
  users: () => string;
  platformUpdate: () => string;
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
