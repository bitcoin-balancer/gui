import { memo, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../shared/shadcn/components/ui/dialog.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/shadcn/components/ui/table.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import { ClipboardService } from '../../../shared/services/clipboard/index.service.ts';
import { formatDate } from '../../../shared/services/transformations/index.service.ts';
import { JWTService, IRefreshTokenRecord } from '../../../shared/backend/auth/jwt/index.service.ts';
import { useAPIRequest } from '../../../shared/hooks/api-request/api-request.hook.ts';
import PageLoadError from '../../../shared/components/page-load-error/index.component.tsx';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import { IDisplayAuthSessionsProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Display Auth Sessions Component
 * Component in charge of displaying the list of auth sessions a user has.
 */
const DisplayAuthSessions = memo(({
  open,
  onOpenChange,
  uid,
  nickname,
}: IDisplayAuthSessionsProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest<IRefreshTokenRecord[]>(
    JWTService.listRecords,
    useMemo(() => [uid], [uid]),
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else if (data.length) {
    content = (
      <Table className='animate-in fade-in duration-700'>
        <TableCaption>A list of refresh JWTs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Issuance</TableHead>
            <TableHead>Refresh JWT</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record) => (
            <TableRow key={record.event_time}>
              <TableCell>{formatDate(record.event_time, 'datetime-short')}</TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' className='max-w-24 sm:max-w-44 md:max-w-52' onClick={() => ClipboardService.writeText(record.token)}><p className='truncate font-normal'>{record.token}</p></Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
            </TableRow>
          ))}

        </TableBody>
      </Table>
    );
  } else {
    content = <p className='text-light text-sm text-center my-5 animate-in fade-in duration-700'>No records were found</p>;
  }
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>

      <DialogContent className='max-h-dvh overflow-y-auto overflow-x-hidden'>

        <DialogHeader>
          <DialogTitle>{nickname}'s Auth Sessions</DialogTitle>
          <DialogDescription>
            Each record represents a session that is likely to be active
          </DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default DisplayAuthSessions;