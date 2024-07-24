

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  openURL,
};
