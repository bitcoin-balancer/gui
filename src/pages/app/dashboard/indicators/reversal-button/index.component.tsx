import { useCallback, useState } from 'react';
import { MoveDownRight, History } from 'lucide-react';
import { delay } from 'web-utils-kit';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import {
  IPriceCrashStateRecord,
  IReversalState,
} from '@/shared/backend/market-state/reversal/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import PriceCrashStateHistoryDialog from './price-crash-state-history-dialog.component.tsx';
import PriceCrashStateRecordDialog from './price-crash-state-record-dialog.component.tsx';
import PriceCrashStatesDialog from '@/pages/app/dashboard/indicators/reversal-button/price-crash-states-dialog.component.tsx';
import { IHistoryDialogConfig } from '@/pages/app/dashboard/indicators/reversal-button/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Reversal Button Component
 * Component in charge of rendering the reversal's indicator button as well as handling its actions.
 */
const ReversalButton = ({ reversalState }: { reversalState: IReversalState | undefined }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState<IHistoryDialogConfig>();
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState<IPriceCrashStateRecord>();
  const [isListDialogOpen, setIsListDialogOpen] = useState<boolean>();





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Utility function to hide the menu asynchronously.
   */
  const hideMenu = async (): Promise<void> => {
    setIsMenuOpen(false);
    await delay(0.5);
  };

  /**
   * Displays the dialog for an individual record.
   * @param record
   */
  const displayRecord = useCallback(
    async (record: IPriceCrashStateRecord) => {
      setIsMenuOpen(false);
      setIsRecordDialogOpen(record);
    },
    [],
  );

  /**
   * Displays the list of price crash states that have been stored.
   */
  const displayList = async () => {
    await hideMenu();
    setIsListDialogOpen(true);
  };

  /**
   * Displays the point history for the active state.
   */
  const displayHistory = async () => {
    await hideMenu();
    setIsHistoryDialogOpen({ id: reversalState!.id, cacheRecord: false });
  };

  /**
   * Displays the menu or the list dialog based on the current state.
   */
  const displayDialog = (): void => {
    if (reversalState === undefined) {
      setIsListDialogOpen(true);
    } else {
      setIsMenuOpen(true);
    }
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ********
        * BUTTON *
        ******** */}
      <button
        className={`h-[45px] text-xs text-white font-bold hover:opacity-80 ${reversalState === undefined ? 'bg-stateless' : ''}`}
        style={
          reversalState !== undefined
            ? {
              background: `linear-gradient(90deg, ${ColorService.INCREASE_2} ${reversalState.points}%, ${ColorService.INCREASE_0} ${reversalState.points}%)`,
            }
            : {}
        }
        onClick={displayDialog}
      >
        {reversalState && reversalState.reversalEventTime ? 'REVERSED' : 'REVERSAL'}
      </button>



      {/* **************
        * ACTIONS MENU *
        ************** */}
      <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent side='bottom'>
          <div className='mx-auto w-full max-w-sm'>
            <SheetHeader className='space-y-0'>
              <SheetTitle>Price crash state</SheetTitle>
              <SheetDescription>Choose what you wish to see</SheetDescription>
            </SheetHeader>

            <div className='flex flex-row justify-center items-stretch gap-2 sm:gap-4 mt-5'>
              <Button
                variant='outline'
                aria-label='View the current state'
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={displayHistory}
              >
                <MoveDownRight aria-hidden='true' />
                <p>Active</p>
              </Button>
              <Button
                variant='outline'
                aria-label='View the list of historical price crash states'
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={displayList}
              >
                <History aria-hidden='true' />
                <p>History</p>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>



      {/* ****************
        * HISTORY DIALOG *
        **************** */}
      {
        isHistoryDialogOpen !== undefined
        && <PriceCrashStateHistoryDialog
          id={isHistoryDialogOpen.id}
          cacheRecord={isHistoryDialogOpen.cacheRecord}
          closeDialog={setIsHistoryDialogOpen}
        />
      }



      {/* ***************
        * RECORD DIALOG *
        *************** */}
      {
        isRecordDialogOpen !== undefined
        && <PriceCrashStateRecordDialog
          record={isRecordDialogOpen}
          closeDialog={setIsRecordDialogOpen}
          setIsHistoryDialogOpen={setIsHistoryDialogOpen}
        />
      }



      {/* *************
        * LIST DIALOG *
        ************* */}
      {
        isListDialogOpen
        && <PriceCrashStatesDialog
          displayRecord={displayRecord}
          closeDialog={setIsListDialogOpen}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ReversalButton;
