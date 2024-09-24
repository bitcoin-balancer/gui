import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { ISectionID, ISections } from '@/shared/components/large-info-dialog/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of supported sections
const SECTIONS: ISections = {
  window: {
    title: 'Window',
    description: '',
  },
  liquidity: {
    title: 'Liquidity',
    description: '',
  },
  coins: {
    title: 'Coins',
    description: '',
  },
  reversal: {
    title: 'Reversal',
    description: '',
  },
  strategy: {
    title: 'Strategy',
    description: '',
  },
  terms: {
    title: 'Terms',
    description: '',
  },
};





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





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the section that will be displayed
  const section = SECTIONS[data];





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent
        className='max-w-[900px]'
      >

        {/* ***************
          * DIALOG HEADER *
          *************** */}
        <DialogHeader>

          <DialogTitle>{section.title}</DialogTitle>
          <DialogDescription>{section.description}</DialogDescription>

        </DialogHeader>



        {/* ****************
          * DIALOG CONTENT *
          **************** */}
        <p>@TODO</p>

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
