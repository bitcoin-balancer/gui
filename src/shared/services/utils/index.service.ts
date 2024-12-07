import { decodeError } from 'error-message-utils';
import { toast } from '@/shared/shadcn/components/ui/use-toast.ts';
import { IHTMLElement } from '@/shared/types.ts';

/* ************************************************************************************************
 *                                          DOM HELPERS                                           *
 ************************************************************************************************ */

/**
 * Scrolls a child element into the view. The top of the visible area of the scrollable ancestor.
 * https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
 * @param parentEl
 * @param childID
 */
const scrollChildIntoView = (parentEl: IHTMLElement, childID: string): void => {
  const el = parentEl.querySelector(`#${childID}`) as Element;
  el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
};





/* ************************************************************************************************
 *                                         TOAST HELPERS                                          *
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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // dom helpers
  scrollChildIntoView,

  // toast helpers
  errorToast,
};
