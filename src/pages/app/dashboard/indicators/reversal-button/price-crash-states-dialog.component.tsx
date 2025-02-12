import {
  memo,
  useMemo,
  useRef,
  Fragment,
} from 'react';
import { Undo2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import {
  ReversalService,
  IPriceCrashStateRecord,
} from '@/shared/backend/market-state/reversal/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
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
 * Price Crash States Dialog Component
 * Component in charge of displaying the price crash state records and handling their actions.
 */
const PriceCrashStatesDialog = memo(({
  displayRecord,
  closeDialog,
}: {
  displayRecord: (record: IPriceCrashStateRecord) => void,
  closeDialog: (nextState: undefined) => void
}) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLDivElement | null>(null);





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
  } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => ReversalService.listRecords(LIMIT),
      queryLimit: LIMIT,
    }),
    [],
  ));
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = (
      <div className='pb-5'>
        <PageLoadError variant='dialog' error={error} />
      </div>
    );
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else if (data.length) {
    content = (
      <>
        <div ref={rowsRef}>
          {data.map((record, i) => (
            <Fragment key={record.id}>
              <button
                aria-label='View more information'
                id={`pcsr-${record.id}`}
                className='flex justify-start items-center w-full py-5 px-6 hover:bg-slate-100'
                onClick={() => displayRecord(record)}
              >
                <div>
                  <div
                    className='flex justify-start items-center'
                  >
                    <h3
                      className='text-base font-semibold'
                    >
                      {typeof record.reversal_event_time === 'number' ? 'Reversed' : 'Eventless'}
                    </h3>
                    {
                      typeof record.reversal_event_time === 'number'
                      && <Undo2
                        aria-hidden='true'
                        className='ml-2 h-5 w-5 rotate-90 text-increase-1'
                      />
                    }
                  </div>
                  <p
                    className='text-light text-xs'
                  >{formatDate(record.event_time, 'datetime-medium')}</p>
                </div>

                <span className='flex-1'></span>

                <Badge
                  aria-label='The highest number of points accumulated during the price crash state'
                  className={ReversalService.getBadgeBGColor(record.highest_points)}
                >
                  {record.highest_points}
                </Badge>

              </button>
              {i < data.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
        {
          (hasMore && data.length >= LIMIT)
          && <div
            className='pb-5'
          >
            <LoadMoreButton
              loadMore={() => loadMore(
                () => ReversalService.listRecords(LIMIT, data.at(-1)!.event_time),
                rowsRef.current!,
                `pcsr-${data.at(-1)!.id}`,
              )}
              loadingMore={loadingMore}
            />
          </div>
        }
      </>
    );
  } else {
    content = <NoRecords />;
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className='p-0'>

        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Price crash states</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceCrashStatesDialog;
