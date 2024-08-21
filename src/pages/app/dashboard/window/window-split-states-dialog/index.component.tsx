import { memo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import StateIcon from '@/shared/components/state-icon/index.component';
import { IComponentProps, IWindowStateDialogData } from '@/pages/app/dashboard/window/window-split-states-dialog/types.ts';
import { prettifyValue } from 'bignumber-utils';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Split States Dialog Component
 * Component in charge of displaying additional information regarding each of the window splits.
 */
const WindowSplitStatesDialog = memo(({
  data: { activeID, windowState },
  closeDialog,
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the information dialog which describes how to the window module operates.
   */
  const displayWindowInfo = (): void => {
    openInfoDialog({
      title: 'Window State',
      content: [
        'DATE RANGE',
        `${formatDate(windowState.window.id[0], 'datetime-medium')}`,
        `${formatDate(windowState.window.id.at(-1)!, 'datetime-medium')}`,
        '-----',
        'NUMBER OF ITEMS',
        `${windowState.window.id.length}`,
        '-----',
        'CURRENT PRICE',
        `${prettifyValue(windowState.window.close.at(-1)!, { format: { prefix: '$' } })}`,
      ],
    });
  };

  /**
   * Handles the closing of the dialog after a small delay.
   */
  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      closeDialog();
    }, 250);
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[700px]'
      >

        <DialogHeader>
          <DialogTitle>
            <button
              className='flex justify-center sm:justify-start items-center'
              onClick={displayWindowInfo}
            >
            Window State
            <StateIcon
              className='ml-2'
              state={windowState.state}
            />
            </button>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        <p>Hey! this is a very cool dialog :)</p>

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowSplitStatesDialog;
export type {
  IWindowStateDialogData,
};
