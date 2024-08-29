import { useCallback, useState } from 'react';
import { delay } from '@/shared/services/utils/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Lazy Dialog Hook
 * Provides utility functions that simplify the management of dialogs that are removed from the DOM
 * on close.
 */
const useLazyDialog = (closeDialog: (nextState: undefined) => void) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(true);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Handles the closing of the dialog after a small delay in order to let the animation complete
   * before removing the element from the DOM.
   */
  const handleCloseDialog = useCallback(
    async (): Promise<void> => {
      setIsDialogOpen(false);
      await delay(0.25);
      closeDialog(undefined);
    },
    [closeDialog],
  );





  /* **********************************************************************************************
   *                                         HOOK EXPORTS                                         *
   ********************************************************************************************** */
  return {
    isDialogOpen,
    handleCloseDialog,
  };
};



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useLazyDialog,
};