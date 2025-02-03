import { INavService } from '@/shared/services/nav/types.ts';

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
  const __CLI_REPO_URL = 'https://github.com/bitcoin-balancer/cli';
  const __CLI_LITE_REPO_URL = 'https://github.com/bitcoin-balancer/cli-lite';
  const __CT_REPO_URL = 'https://github.com/bitcoin-balancer/ct';

  // the URL for the docker images
  const __POSTGRES_IMAGE_URL = 'https://hub.docker.com/_/postgres';
  const __API_IMAGE_URL = 'https://hub.docker.com/r/jesusgraterol/balancer-api';
  const __GUI_IMAGE_URL = 'https://hub.docker.com/r/jesusgraterol/balancer-gui';
  const __CT_IMAGE_URL = 'https://hub.docker.com/r/jesusgraterol/balancer-ct';



  /* **********************************************************************************************
   *                                     EXTERNAL URLS BUILDER                                    *
   ********************************************************************************************** */

  /**
   * Builds the URL for a commit from the GUI's repository.
   * @param hash
   * @returns string
   */
  const buildGUICommitURL = (hash: string): string => `${__GUI_REPO_URL}/commit/${hash}`;

  /**
   * Builds the URL for a commit from the API's repository.
   * @param hash
   * @returns string
   */
  const buildAPICommitURL = (hash: string): string => `${__API_REPO_URL}/commit/${hash}`;





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
   * Opens the CLI's respository page in a new tab.
   */
  const openCLIRepo = (): void => openURL(__CLI_REPO_URL);

  /**
   * Opens the CLI-LITE's respository page in a new tab.
   */
  const openCLILITERepo = (): void => openURL(__CLI_LITE_REPO_URL);

  /**
   * Opens the GUI's respository page in a new tab.
   */
  const openGUIRepo = (): void => openURL(__GUI_REPO_URL);

  /**
   * Opens the GitHub page for a commit made to the GUI in a new tab.
   * @param hash
   */
  const openGUICommit = (hash: string): void => openURL(buildGUICommitURL(hash));

  /**
   * Opens the API's respository page in a new tab.
   */
  const openAPIRepo = (): void => openURL(__API_REPO_URL);

  /**
   * Opens the GitHub page for a commit made to the API in a new tab.
   * @param hash
   */
  const openAPICommit = (hash: string): void => openURL(buildAPICommitURL(hash));

  /**
   * Opens the Cloudflare Tunnel's respository page in a new tab.
   */
  const openCTRepo = (): void => openURL(__CT_REPO_URL);

  /**
   * Opens the Docker Image page for postgres in a new tab.
   */
  const openPostgresImage = (): void => openURL(__POSTGRES_IMAGE_URL);

  /**
   * Opens the Docker Image page for the API in a new tab.
   */
  const openAPIImage = (): void => openURL(__API_IMAGE_URL);

  /**
   * Opens the Docker Image page for the GUI in a new tab.
   */
  const openGUIImage = (): void => openURL(__GUI_IMAGE_URL);

  /**
   * Opens the Docker Image page for the CT in a new tab.
   */
  const openCTImage = (): void => openURL(__CT_IMAGE_URL);





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
  const signIn = (): string => '/auth/sign-in';

  /**
   * Builds the path to the update-password page.
   * @returns string
   */
  const updatePassword = (): string => '/auth/update-password';

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
   * Builds the path to the position page.
   * @param id
   * @returns string
   */
  const position = (id: string): string => `/app/position/${id}`;

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

  /**
   * Builds the path to the platform update page.
   * @returns string
   */
  const platformUpdate = (): string => '/app/platform-update';





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // external urls builder
    buildGUICommitURL,
    buildAPICommitURL,

    // external navigation
    openURL,
    createNewInstance,
    openGitHubPage,
    openCLIRepo,
    openCLILITERepo,
    openGUIRepo,
    openGUICommit,
    openAPIRepo,
    openAPICommit,
    openCTRepo,
    openPostgresImage,
    openAPIImage,
    openGUIImage,
    openCTImage,

    // internal navigation
    landing,
    signIn,
    updatePassword,
    dashboard,
    positions,
    position,
    server,
    adjustments,
    ipBlacklist,
    users,
    platformUpdate,
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
