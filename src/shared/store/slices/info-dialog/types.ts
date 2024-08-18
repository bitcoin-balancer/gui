

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Dialog Configuration
 * The configuration that will be used to display the dialog.
 */
type IInfoDialogConfig = {
  // the title of the information section
  title: string;

  // the short description of the information section
  description?: string;

  // the dialog's content
  content: string | string[];
};

/**
 * Info Dialog Slice
 * ...
 */
type IInfoDialogSlice = {
  // if enabled, the dialog will be present on the document
  isInfoDialogOpen: boolean;

  // the configuration that will be used to populate the confirmation dialog
  infoDialogConfig: IInfoDialogConfig | undefined;

  // the dialog's controllers
  openInfoDialog: (config: IInfoDialogConfig) => void;
  closeInfoDialog: () => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IInfoDialogConfig,
  IInfoDialogSlice,
};
