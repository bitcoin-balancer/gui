import {
  useMemo,
  useState,
  useRef,
  Fragment,
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
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { NotificationService, INotification } from '@/shared/backend/notification/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { useAPIRequest } from '@/shared/hooks/api-request/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import LoadMoreButton from '@/shared/components/load-more-button/index.component.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Notifications Dialog Component
 * Component in charge of displaying the platform notifications.
 */
const NotificationsDialog = ({
  open,
  onOpenChange,
}: { open: boolean, onOpenChange: (open: boolean) => void }) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLDivElement | null>(null);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIRequest<INotification[]>(
    NotificationService.list,
    useMemo(() => [LIMIT], []),
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
        const nextRecords = await NotificationService.list(
          LIMIT,
          data.at(-1)!.id,
        );

        // add the new records to the DOM
        flushSync(() => {
          setData([...data, ...nextRecords]);
          setHasMore(nextRecords.length >= LIMIT);
        });

        // scroll to the beginning of the new page
        const el = rowsRef.current?.querySelector(`#nd-${data.at(-1)!.id}`) as Element;
        el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
      } catch (e) {
        errorToast(e);
      } finally {
        setLoadingMore(false);
      }
    },
    [data, setData],
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
        <div ref={rowsRef}>
          {data.map((record, i) => (
            <Fragment key={record.id}>
              <article
                id={`nd-${record.id}`}
              >
                <div
                  className='flex justify-start items-center'
                >
                  <p
                    className='font-bold'
                  >{record.title}</p>
                  <span className='flex-1'></span>
                  <Badge
                    className='text-xs max-w-24 sm:max-w-40'
                  >
                    <p
                      className='truncate'
                    >{record.sender}</p>
                  </Badge>
                </div>
                <p
                  className='text-sm  mt-1'
                >{record.description}</p>
                <p
                  className='text-xs text-light mt-1'
                >{formatDate(record.event_time, 'datetime-medium')}</p>
              </article>
              {i < data.length - 1 && <Separator className='my-8' />}
            </Fragment>
          ))}
        </div>
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
          <DialogTitle>Notifications</DialogTitle>
          <DialogDescription>
            Events broadcasted by the Balancer API
          </DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotificationsDialog;
