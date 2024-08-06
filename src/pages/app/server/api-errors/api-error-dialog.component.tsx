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
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { ClipboardService } from '@/shared/services/clipboard/index.service.ts';
import { IAPIErrorDialogProps } from '@/pages/app/server/api-errors/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Dialog Component
 * Component in charge of displaying an API Error and allowing users to download them for further
 * analysis.
 */
const APIErrorDialog = ({ open, onOpenChange, record }: IAPIErrorDialogProps) => {
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
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent
        className='max-h-dvh overflow-y-auto overflow-x-hidden max-w-[500px]'
      >

        <DialogHeader>
          <DialogTitle
            className='flex justify-center sm:justify-start items-center'
          >
            API Error
            <a
              className='ml-2'
              href={`data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(record))}`}
              download={`api-error-${record.id}.json`}
              >
                <Download aria-hidden='true' className='w-4 h-4' />
            </a>
          </DialogTitle>
          <DialogDescription>
            Corresponds to an error that was thrown in the API
          </DialogDescription>
        </DialogHeader>


        <div
          className='flex justify-center items-center'
        >
          <p
            className='text-light text-sm'
          >Date</p>
          <span className='flex-1'></span>
          <p>{formatDate(record.event_time, 'datetime-medium')}</p>
        </div>

        <div
          className='flex justify-center items-center mt-2'
        >
          <p
            className='text-light text-sm'
          >ID</p>
          <span className='flex-1'></span>
          <p>{record.id}</p>
        </div>

        {
          typeof record.uid === 'string'
          && <div
            className='flex justify-center items-center mt-2'
          >
            <p
              className='text-light text-sm'
            >UID</p>
            <span className='flex-1'></span>
            <Tooltip>
              <TooltipTrigger
                onClick={() => ClipboardService.writeText(record.uid!)}
                tabIndex={-1}
              >
                <p
                  className='max-w-44 sm:max-w-96 xl:max-w-[400px] truncate'
                >{record.uid}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{record.uid}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        }

        {
          typeof record.uid === 'string'
          && <div
            className='flex justify-center items-center mt-2'
          >
            <p
              className='text-light text-sm'
            >IP address</p>
            <span className='flex-1'></span>
            <Tooltip>
              <TooltipTrigger
                onClick={() => ClipboardService.writeText(record.ip!)}
                tabIndex={-1}
              >
                <p
                  className='max-w-44 sm:max-w-96 xl:max-w-[400px] truncate'
                >{record.ip}</p>
              </TooltipTrigger>
              <TooltipContent>
                <p>{record.ip}</p>
              </TooltipContent>
            </Tooltip>
          </div>
        }

        <div
          className='flex justify-center items-center mt-2'
        >
          <p
            className='text-light text-sm'
          >Origin</p>
          <span className='flex-1'></span>
          <Tooltip>
            <TooltipTrigger tabIndex={-1}>
              <p
                className='max-w-44 sm:max-w-96 xl:max-w-[400px] truncate'
              >{record.origin}</p>
            </TooltipTrigger>
            <TooltipContent>
              <p>{record.origin}</p>
            </TooltipContent>
          </Tooltip>
        </div>

        <div
          className='flex justify-center items-center mt-2'
        >
          <p
            className='text-light text-sm'
          >Code</p>
          <span className='flex-1'></span>
          <p><strong>{code}</strong></p>
        </div>

        <div
          className='flex flex-col sm:flex-row justify-start items-start mt-2'
        >
          <p
            className='text-light text-sm min-w-24'
          >Message</p>
          <span className='flex-1'></span>
          <p
            className='mt-2 sm:mt-0 text-right'
          >{message}</p>
        </div>

        {
          record.args !== null
          && <div
            className='mt-2 overflow-x-auto'
          >
            <p
              className='text-light text-sm'
            >Args</p>
            <div
              className='mt-2'
            >
              <pre
                className='text-sm'
              >
                {JSON.stringify(record.args, null, 2)}
              </pre>
            </div>
          </div>
        }

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrorDialog;
