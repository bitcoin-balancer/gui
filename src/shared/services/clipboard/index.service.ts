import { toast } from '../../shadcn/components/ui/use-toast';
import { IClipboardService } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Clipboard Service Factory
 * Generates the object in charge of interacting with the Clipboard API.
 * @returns IClipboardService
 */
const clipboardServiceFactory = (): IClipboardService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // indicates if the Clipboard API is supported by the user's browser
  const __isSupported: boolean = Boolean(window)
    && Boolean(window.navigator)
    && Boolean(window.navigator.clipboard)
    && typeof window.navigator.clipboard.readText === 'function'
    && typeof window.navigator.clipboard.writeText === 'function';





  /* **********************************************************************************************
   *                                            HELPERS                                           *
   ********************************************************************************************** */

  /**
   * Verifies if the Clipboard API is supported by the user's browser.
   * @throws
   * - if the API is not supported
   */
  const __validateAvailability = (): void => {
    if (!__isSupported) {
      throw new Error('The Clipboard API is not supported by the browser.');
    }
  };




  /* **********************************************************************************************
   *                                            ACTIONS                                           *
   ********************************************************************************************** */

  /**
   * Writes text to the system clipboard.
   * @returns Promise<void>
   * @throws
   * - NotAllowedError: if writing to the clipboard is not allowed.
   */
  const writeText = async (text: string): Promise<void> => {
    __validateAvailability();
    await window.navigator.clipboard.writeText(text);
    toast({ title: 'Copied to Clipboard', description: text });
  };

  /**
   * Requests text from the system clipboard.
   * @returns Promise<string>
   * @throws
   * - NotAllowedError: if the access to read the clipboard is not allowed
   * - NotFoundError: if the clipboard indicates that it contains data that can be represented as a
   * text but is unable to provide a textual representation
   */
  const readText = (): Promise<string> => {
    __validateAvailability();
    return window.navigator.clipboard.readText();
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get isSupported() {
      return __isSupported;
    },

    // actions
    writeText,
    readText,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ClipboardService = clipboardServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ClipboardService,
};
