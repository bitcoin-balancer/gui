import { decodeError } from 'error-message-utils';
import { toast } from '../../shadcn/components/ui/use-toast.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds the props and displays an error toast.
 * @param error
 * @param title?
 * @returns Toast
 */
const errorToast = (error: unknown, title: string = 'Error') => toast({
  variant: 'destructive',
  title,
  description: decodeError(error).message,
});

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
  delay,
};
