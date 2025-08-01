import { useMemo } from 'react';
import { Download } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { copyToClipboard } from '@/shared/services/utils/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IAPIErrorDialogProps } from '@/pages/app/server/api-errors/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Dialog Component
 * Component in charge of displaying an API Error and allowing users to download them for further
 * analysis.
 */
const APIErrorDialog = ({ record, closeDialog }: IAPIErrorDialogProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // decoded error
  const { message, code } = useMemo(() => decodeError(record.error), [record]);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className="max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex justify-center sm:justify-start items-center">
            API Error
            <a
              className="ml-2"
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record))}`}
              download={`api-error-${record.id}.json`}
            >
              <Download
                aria-hidden="true"
                className="w-4 h-4"
              />
            </a>
          </DialogTitle>
          <DialogDescription>Corresponds to an error that was thrown in the API</DialogDescription>
        </DialogHeader>

        <div className="flex justify-center items-center">
          <p className="text-light text-sm">Date</p>
          <span className="flex-1"></span>
          <p>{formatDate(record.event_time, 'datetime-medium')}</p>
        </div>

        <div className="flex justify-center items-center mt-2">
          <p className="text-light text-sm">ID</p>
          <span className="flex-1"></span>
          <p>{record.id}</p>
        </div>

        {typeof record.uid === 'string' && (
          <div className="flex justify-center items-center mt-2">
            <p className="text-light text-sm">UID</p>
            <span className="flex-1"></span>
            <Tooltip>
              <TooltipTrigger
                onClick={() => copyToClipboard(record.uid!)}
                tabIndex={-1}
              >
                <p className="max-w-44 sm:max-w-96 xl:max-w-[400px] truncate">{record.uid}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{record.uid}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        {typeof record.ip === 'string' && (
          <div className="flex justify-center items-center mt-2">
            <p className="text-light text-sm">IP address</p>
            <span className="flex-1"></span>
            <Tooltip>
              <TooltipTrigger
                onClick={() => copyToClipboard(record.ip!)}
                tabIndex={-1}
              >
                <p className="max-w-44 sm:max-w-96 xl:max-w-[400px] truncate">{record.ip}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{record.ip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        )}

        <div className="flex justify-center items-center mt-2">
          <p className="text-light text-sm">Origin</p>
          <span className="flex-1"></span>
          <Tooltip>
            <TooltipTrigger tabIndex={-1}>
              <Badge
                variant="secondary"
                className="max-w-44 sm:max-w-96 xl:max-w-[400px] truncate"
              >
                <p className="truncate text-sm">{record.origin}</p>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>{record.origin}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div className="flex justify-center items-center mt-2">
          <p className="text-light text-sm">Code</p>
          <span className="flex-1"></span>
          <Badge
            variant="destructive"
            className="max-w-44 sm:max-w-96 xl:max-w-[400px]"
          >
            <p className="truncate">{code}</p>
          </Badge>
        </div>

        <div className="flex flex-col sm:flex-row justify-start items-start mt-2">
          <p className="text-light text-sm min-w-24">Message</p>
          <span className="flex-1"></span>
          <p className="mt-2 sm:mt-0 text-right break-all">{message}</p>
        </div>

        {record.args !== null && (
          <div className="mt-2 overflow-x-auto p-5 rounded-lg bg-slate-900 text-slate-50 text-sm">
            <pre>{JSON.stringify(record.args, null, 2)}</pre>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrorDialog;
