import { useCallback, useState } from 'react';
import { delay } from '@/shared/services/utils/index.service.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Lazy Dialog Hook
 * Provides utility functions that simplify the management of dialogs that are removed from the DOM
 * on close.
 */
const useLazyDialog = (closeDialog: () => void) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);





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
      closeDialog();
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
