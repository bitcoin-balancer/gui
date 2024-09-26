import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import ValueAveraging from '@/shared/components/large-info-dialog/value-averaging.component';
import Terms from '@/shared/components/large-info-dialog/terms.component.tsx';
import { ISectionID, ISections } from '@/shared/components/large-info-dialog/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of supported sections
const SECTIONS: ISections = {
  value_averaging: {
    title: 'Value averaging',
    description: '',
  },
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

          <DialogTitle className='text-xl'>{section.title}</DialogTitle>
          <DialogDescription>{section.description}</DialogDescription>

        </DialogHeader>



        {/* ****************
          * DIALOG CONTENT *
          **************** */}
        { data === 'value_averaging' && <ValueAveraging />}
        { data === 'terms' && <Terms />}

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
