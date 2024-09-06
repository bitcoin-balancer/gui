import { useCallback, useState } from 'react';
import {
  IPriceCrashStateRecord,
  IReversalState,
} from '@/shared/backend/market-state/reversal/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import PriceCrashStatesDialog from '@/pages/app/dashboard/indicators/reversal-button/price-crash-states-dialog.component.tsx';
import PriceCrashStateRecordDialog from './price-crash-state-record-dialog.component';

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
  const [isHistoryDialogOpen, setIsHistoryDialogOpen] = useState<string>();
  const [isRecordDialogOpen, setIsRecordDialogOpen] = useState<IPriceCrashStateRecord>();
  const [isListDialogOpen, setIsListDialogOpen] = useState<boolean>();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the event history dialog.
   */
  const displayHistory = useCallback(
    (id: string) => setIsHistoryDialogOpen(id),
    [],
  );

  /**
   * Displays the dialog for an individual record.
   * @param record
   */
  const displayRecord = useCallback(
    (record: IPriceCrashStateRecord) => {
      setIsRecordDialogOpen(record);
    },
    [],
  );

  /**
   * Displays the menu or the list dialog based on the current state.
   */
  const displayDialog = (): void => {
    setIsListDialogOpen(true);
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



      {/* ***************
        * RECORD DIALOG *
        *************** */}
      {
        isRecordDialogOpen !== undefined
        && <PriceCrashStateRecordDialog
          record={isRecordDialogOpen}
          closeDialog={setIsRecordDialogOpen}
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
