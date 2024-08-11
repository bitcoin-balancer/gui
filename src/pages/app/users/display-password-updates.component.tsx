import {
  memo,
  useMemo,
  useState,
  useRef,
  useCallback,
} from 'react';
import { flushSync } from 'react-dom';
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
import { errorToast, scrollChildIntoView } from '@/shared/services/utils/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { UserService, IPasswordUpdate } from '@/shared/backend/auth/user/index.service.ts';
import { useAPIRequest } from '@/shared/hooks/api-request/index.hook.ts';
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
    setData,
    loading,
    error,
  } = useAPIRequest<IPasswordUpdate[]>(
    UserService.listUserPasswordUpdates,
    useMemo(() => [uid, LIMIT], [uid]),
  );
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Loads the next set of records if there are any.
   */
  const loadMore = useCallback(
    async () => {
      try {
        setLoadingMore(true);
        const nextRecords = await UserService.listUserPasswordUpdates(
          uid,
          LIMIT,
          data.at(-1)!.event_time,
        );

        // add the new records to the DOM
        flushSync(() => {
          setData([...data, ...nextRecords]);
          setHasMore(nextRecords.length >= LIMIT);
        });

        // scroll to the beginning of the new page
        scrollChildIntoView(rowsRef.current!, `#pur-${data.at(-1)!.event_time}`);
      } catch (e) {
        errorToast(e);
      } finally {
        setLoadingMore(false);
      }
    },
    [data, setData, uid],
  );





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
                className='animate-in fade-in duration-700'
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
            loadMore={loadMore}
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
