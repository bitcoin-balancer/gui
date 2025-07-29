/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Confirmation Mode
 * The confirmation dialog can be used to confirm an action with a simple click or it can also
 * require any kind of input.
 */
type IConfirmationDialogMode = 'OTP' | 'CLICK';

/**
 * Dialog Configuration
 * The configuration that will be used to display the dialog and handle the confirmation of an
 * action.
 */
type IConfirmationDialogConfig = {
  mode: IConfirmationDialogMode;
  title?: string;
  description: string;
  content?: string | string[];
  onConfirmation: (confirmation: string) => Promise<void>;
};

/**
 * Confirmation Dialog Slice
 * ...
 */
type IConfirmationDialogSlice = {
  // if enabled, the dialog will be present on the document
  isConfirmationDialogOpen: boolean;

  // the configuration that will be used to populate the confirmation dialog
  confirmationDialogConfig: IConfirmationDialogConfig | undefined;

  // the dialog's controllers
  openConfirmationDialog: (config: IConfirmationDialogConfig) => void;
  closeConfirmationDialog: () => void;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IConfirmationDialogMode, IConfirmationDialogConfig, IConfirmationDialogSlice };
