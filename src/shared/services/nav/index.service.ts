import { INavService } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Nav Service Factory
 * Generates the object in charge of managing in-app and external navigation.
 * @returns INavService
 */
const navServiceFactory = (): INavService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // the URL to the project's GitHub Page
  const __GITHUB_URL = 'https://github.com/bitcoin-balancer';





  /* **********************************************************************************************
   *                                      EXTERNAL NAVIGATION                                     *
   ********************************************************************************************** */

  /**
   * Opens an URL in the current or a new tab.
   * @param url
   * @param newTab?
   */
  const openURL = (url: string, newTab: boolean = true): void => {
    if (newTab) {
      window.open(url, '_blank', 'noopener noreferrer');
    } else {
      window.open(url);
    }
  };

  /**
   * Opens Balancer's GitHub Page in a new tab.
   * @returns void
   */
  const openGitHubPage = (): void => openURL(__GITHUB_URL);




  /* **********************************************************************************************
   *                                      INTERNAL NAVIGATION                                     *
   ********************************************************************************************** */

  /**
   * Builds the path to the landing page.
   * @returns string
   */
  const landing = (): string => '/';

  /**
   * Builds the path to the sign-in page.
   * @returns string
   */
  const signIn = (): string => '/sign-in';

  /**
   * Builds the path to the update-password page.
   * @returns string
   */
  const updatePassword = (): string => '/update-password';

  /**
   * Builds the path to the dashboard page.
   * @returns string
   */
  const dashboard = (): string => '/app';

  /**
   * Builds the path to the positions page.
   * @returns string
   */
  const positions = (): string => '/app/positions';

  /**
   * Builds the path to the server page.
   * @returns string
   */
  const server = (): string => '/app/server';

  /**
   * Builds the path to the adjustments page.
   * @returns string
   */
  const adjustments = (): string => '/app/adjustments';

  /**
   * Builds the path to the users page.
   * @returns string
   */
  const users = (): string => '/app/users';





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // external navigation
    openURL,
    openGitHubPage,

    // internal navigation
    landing,
    signIn,
    updatePassword,
    dashboard,
    positions,
    server,
    adjustments,
    users,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const NavService = navServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  NavService,
};
