import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { ISectionID } from '@/shared/components/large-info-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Large Info Dialog Component
 * Component in charge of displaying large pieces of information.
 */
const LargeInfoDialog = ({ data }: { data: ISectionID }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const closeLargeInfoDialog = useBoundStore((state) => state.closeLargeInfoDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeLargeInfoDialog);
  const isOpen = useBoundStore((state) => state.isInfoDialogOpen);
  const config = useBoundStore((state) => state.infoDialogConfig!);
  const closeDialog = useBoundStore((state) => state.closeInfoDialog);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent
        className='max-w-[900px]'
      >

        {/* ***************
          * DIALOG HEADER *
          *************** */}
        <DialogHeader>

          <DialogTitle>{config?.title}</DialogTitle>
          <DialogDescription>{config?.description}</DialogDescription>

        </DialogHeader>



        {/* ****************
          * DIALOG CONTENT *
          **************** */}
        

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LargeInfoDialog;
export type {
  ISectionID,
};
