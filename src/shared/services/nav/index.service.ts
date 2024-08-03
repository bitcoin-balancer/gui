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

  // the URL for the services' repos
  const __API_REPO_URL = 'https://github.com/bitcoin-balancer/api';
  const __GUI_REPO_URL = 'https://github.com/bitcoin-balancer/gui';



  /* **********************************************************************************************
   *                                      EXTERNAL NAVIGATION                                     *
   ********************************************************************************************** */

  /**
   * Opens an URL in the current or a new tab.
   * @param url
   * @param newTab?
   * @param noReferrer?
   */
  const openURL = (url: string, newTab: boolean = true, noReferrer: boolean = true): void => {
    if (newTab) {
      if (noReferrer) {
        window.open(url, '_blank', 'noopener noreferrer');
      } else {
        window.open(url, '_blank');
      }
    } else {
      window.open(url);
    }
  };

  /**
   * Opens another Balancer tab.
   */
  const createNewInstance = (): void => openURL(window.location.href, true, false);

  /**
   * Opens Balancer's GitHub Page in a new tab.
   */
  const openGitHubPage = (): void => openURL(__GITHUB_URL);

  /**
   * Opens the GUI's respository page in a new tab.
   */
  const openGUIRepo = (): void => openURL(__GUI_REPO_URL);

  /**
   * Opens the GitHub page for a commit made to the GUI in a new tab.
   * @param hash
   */
  const openGUICommit = (hash: string): void => openURL(`${__GUI_REPO_URL}/commit/${hash}`);

  /**
   * Opens the API's respository page in a new tab.
   */
  const openAPIRepo = (): void => openURL(__API_REPO_URL);

  /**
   * Opens the GitHub page for a commit made to the API in a new tab.
   * @param hash
   */
  const openAPICommit = (hash: string): void => openURL(`${__API_REPO_URL}/commit/${hash}`);





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
   * Builds the path to the IP address blacklist page.
   * @returns string
   */
  const ipBlacklist = (): string => '/app/ip-blacklist';

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
    createNewInstance,
    openGitHubPage,
    openGUIRepo,
    openGUICommit,
    openAPIRepo,
    openAPICommit,

    // internal navigation
    landing,
    signIn,
    updatePassword,
    dashboard,
    positions,
    server,
    adjustments,
    ipBlacklist,
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
