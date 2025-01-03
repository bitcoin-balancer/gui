import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Info Dialog Component
 * Component in charge of displaying additional information about certain sections.
 */
const InfoDialog = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const isOpen = useBoundStore((state) => state.isInfoDialogOpen);
  const config = useBoundStore((state) => state.infoDialogConfig!);
  const closeDialog = useBoundStore((state) => state.closeInfoDialog);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content: string[] | undefined;
  if (config !== undefined && config.content !== undefined) {
    content = typeof config.content === 'string' ? [config.content] : config.content;
  }
  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent
        className='max-w-[80%] sm:max-w-[330px] max-h-[85dvh] sm:max-h-[70dvh]'
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
        {
          content
          && content.map((item, i) => <p key={i}>{item}</p>)
        }

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default InfoDialog;
