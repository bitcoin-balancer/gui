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
const buildErrorToast = (error: unknown, title: string = 'Error'): Toast => ({
  variant: 'destructive',
  title,
  description: decodeError(error).message,
});

/**
 * Formats the number that will be inserted in a badge so it doesn't take too much space.
 * @param count
 * @returns string | undefined
 */
const formatBadgeCount = (count: number): string | undefined => {
  if (count === 0) {
    return undefined;
  }
  if (count >= 9) {
    return '9+';
  }
  return String(count);
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
  buildErrorToast,
  formatBadgeCount,
  delay,
};
