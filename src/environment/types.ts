/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Environment Variables
 * The following environment variables are used to modify the behavior of the app based on the
 * deployment environment of the build.
 */
type IEnvironment = {
  // the kind of build that was performed
  production: boolean;

  // the current version of the GUI
  version: string;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IEnvironment };
