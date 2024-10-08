

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Clipboard Service
 * Object in charge of interacting with the Clipboard API.
 */
type IClipboardService = {
  // properties
  isSupported: boolean;

  // actions
  writeText: (text: string) => Promise<void>;
  readText: () => Promise<string>;
};




/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IClipboardService,

  // types
  // ...
};
