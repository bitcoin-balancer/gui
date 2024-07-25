import { decodeError } from 'error-message-utils';
import { Toast } from '../../shadcn/components/ui/use-toast.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds the props required to display an error toast.
 * @param error
 * @param title
 * @returns Toast
 */
const errorToast = (error: unknown, title: string = 'Error'): Toast => ({
  variant: 'destructive',
  title,
  description: decodeError(error).message,
});

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
 * Creates an asynchronous delay that resolves once the provided seconds have passed.
 * @param seconds
 * @returns Promise<void>
 */
const delay = (seconds: number): Promise<void> => new Promise((resolve) => {
  setTimeout(resolve, Math.round(seconds * 1000));
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  errorToast,
  openURL,
  delay,
};