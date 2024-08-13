import { memo, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table.tsx';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { UserService, IPasswordUpdate } from '@/shared/backend/auth/user/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import LoadMoreButton from '@/shared/components/load-more-button/index.component.tsx';
import { IDisplayAuthSessionsProps } from '@/pages/app/users/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





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
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLTableSectionElement | null>(null);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    loading,
    error,
    hasMore,
    loadMore,
    loadingMore,
  } = useAPIFetch<IPasswordUpdate[]>(useMemo(
    () => ({
      fetchFunc: { func: UserService.listUserPasswordUpdates, args: [uid, LIMIT] },
      queryLimit: LIMIT,
    }),
    [uid],
  ));





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else if (data.length) {
    content = (
      <>
        <Table
          className='animate-in fade-in duration-700'
        >
          <TableCaption>A list of password update records</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>#</TableHead>
              <TableHead>Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody ref={rowsRef}>
            {data.map((record, i) => (
              <TableRow
                key={record.event_time}
                id={`pur-${record.event_time}`}
              >
                <TableCell>
                  <p
                    className='text-light'
                  >{i + 1}</p>
                </TableCell>
                <TableCell>
                  <p
                    className='sm:hidden'
                  >{formatDate(record.event_time, 'datetime-medium')}</p>
                  <p
                    className='hidden sm:block'
                  >{formatDate(record.event_time, 'datetime-long')}</p>
                </TableCell>
              </TableRow>
            ))}

          </TableBody>
        </Table>
        {
          (hasMore && data.length >= LIMIT)
          && <LoadMoreButton
            loadMore={() => loadMore(
              {
                func: UserService.listUserPasswordUpdates,
                args: [uid, LIMIT, data.at(-1)!.event_time],
              },
              rowsRef.current!,
              `pur-${data.at(-1)!.event_time}`,
            )}
            loadingMore={loadingMore}
          />
        }
      </>
    );
  } else {
    content = <NoRecords />;
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => onOpenChange(false)}
    >
      <DialogContent>

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
