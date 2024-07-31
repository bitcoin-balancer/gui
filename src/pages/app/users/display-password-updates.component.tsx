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
/* import { Button } from '../../../shared/shadcn/components/ui/button.tsx'; */
import { formatDate } from '../../../shared/services/transformations/index.service.ts';
import { UserService, IPasswordUpdate } from '../../../shared/backend/auth/user/index.service.ts';
import { useAPIRequest } from '../../../shared/hooks/api-request/api-request.hook.ts';
import PageLoadError from '../../../shared/components/page-load-error/index.component.tsx';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import { IDisplayAuthSessionsProps } from './types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const __LIMIT = 30;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Display Password Updates Component
 * Component in charge of displaying the list of password update records a user has.
 */
const DisplayPasswordUpdates = memo(({
  open,
  onOpenChange,
  uid,
  nickname,
}: IDisplayAuthSessionsProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest<IPasswordUpdate[]>(
    UserService.listUserPasswordUpdates,
    useMemo(() => [uid, __LIMIT], [uid]),
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
        <TableCaption>A list of password update records</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>#</TableHead>
            <TableHead>Date</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((record, i) => (
            <TableRow key={record.event_time}>
              <TableCell><p className='text-light'>{i + 1}</p></TableCell>
              <TableCell>
                <p className='sm:hidden'>{formatDate(record.event_time, 'datetime-medium')}</p>
                <p className='hidden sm:block'>{formatDate(record.event_time, 'datetime-long')}</p>
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
          <DialogTitle>{nickname}'s Password Updates</DialogTitle>
          <DialogDescription>
            Each record represents a time {nickname} changed their pasword
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
export default DisplayPasswordUpdates;
