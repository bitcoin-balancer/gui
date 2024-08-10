import {
  useMemo,
  useState,
  useRef,
  Fragment,
} from 'react';
import { flushSync } from 'react-dom';
import { Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
// import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { NotificationService, INotification } from '@/shared/backend/notification/index.service.ts';
import { useAPIRequest } from '@/shared/hooks/api-request/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator';

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
  const loadMore = async () => {
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
      // https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollIntoView
      const el = rowsRef.current?.querySelector(`#nd-${data.at(-1)!.id}`) as Element;
      el.scrollIntoView({ block: 'start', inline: 'nearest', behavior: 'smooth' });
    } catch (e) {
      errorToast(e);
    } finally {
      setLoadingMore(false);
    }
  };




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
              <article id={`nd-${record.id}`}>
                <p>{record.sender}</p>
                <p>{record.title}</p>
              </article>
              {i < data.length - 1 && <Separator className='py-2' />}
            </Fragment>
          ))}
        </div>
        {
          (hasMore && data.length >= LIMIT)
          && <Button
            variant='ghost'
            className='w-full'
            onClick={loadMore}
            disabled={loadingMore}
          >
            {
              loadingMore
              && <Loader2
                className='mr-2 h-4 w-4 animate-spin'
              />} Load more
          </Button>
        }
      </>
    );
  } else {
    content = <p
      className='text-light text-sm text-center my-5 animate-in fade-in duration-700'
    >No records were found</p>;
  }
  return (
    <Dialog
      open={open}
      onOpenChange={() => onOpenChange(false)}
    >
      <DialogContent
        className='max-h-dvh overflow-y-auto overflow-x-hidden'
      >

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
