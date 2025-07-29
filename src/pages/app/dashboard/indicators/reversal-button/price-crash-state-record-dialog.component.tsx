import { memo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import {
  ReversalService,
  IPriceCrashStateRecord,
} from '@/shared/backend/market-state/reversal/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IHistoryDialogConfig } from '@/pages/app/dashboard/indicators/reversal-button/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Price Crash State Record Dialog Component
 * Component in charge of displaying a price crash state record.
 */
const PriceCrashStateRecordDialog = memo(
  ({
    record,
    closeDialog,
    setIsHistoryDialogOpen,
  }: {
    record: IPriceCrashStateRecord;
    closeDialog: (nextState: undefined) => void;
    setIsHistoryDialogOpen: (nextState: IHistoryDialogConfig | undefined) => void;
  }) => {
    /* **********************************************************************************************
     *                                             STATE                                            *
     ********************************************************************************************** */
    const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);

    /* **********************************************************************************************
     *                                           COMPONENT                                          *
     ********************************************************************************************** */
    return (
      <Dialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-[400px]">
          <DialogHeader>
            <DialogTitle>Price crash state</DialogTitle>
            <DialogDescription className="text-xs">{record.id}</DialogDescription>
          </DialogHeader>

          <div className="flex justify-center items-center">
            <p className="text-light text-sm">Crashed at</p>
            <span className="flex-1"></span>
            <p className="text-sm">{formatDate(record.event_time, 'datetime-medium')}</p>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-light text-sm">Reversed at</p>
            <span className="flex-1"></span>
            <p className="text-sm">
              {typeof record.reversal_event_time === 'number'
                ? formatDate(record.reversal_event_time, 'datetime-medium')
                : 'N/A'}
            </p>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-light text-sm">Highest points</p>
            <span className="flex-1"></span>
            <Badge className={ReversalService.getBadgeBGColor(record.highest_points)}>
              {record.highest_points}
            </Badge>
          </div>

          <div className="flex justify-center items-center">
            <p className="text-light text-sm">Final points</p>
            <span className="flex-1"></span>
            <Badge className={ReversalService.getBadgeBGColor(record.final_points)}>
              {record.final_points}
            </Badge>
          </div>

          <Button onClick={() => setIsHistoryDialogOpen({ id: record.id, cacheRecord: true })}>
            View history
          </Button>
        </DialogContent>
      </Dialog>
    );
  },
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceCrashStateRecordDialog;
