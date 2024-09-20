import { formatDistance } from 'date-fns';
import { useMemo, useRef, Fragment } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { PositionService, ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { formatDate, formatPNL } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
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
 * Positions Dialog Component
 * Component in charge of displaying the positions.
 */
const PositionsDialog = ({ closeDialog }: { closeDialog: (nextState: undefined) => void }) => {
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
  } = useAPIFetch<ICompactPosition[]>(useMemo(
    () => ({
      fetchFunc: { func: PositionService.listCompactPositions, args: [LIMIT] },
      queryLimit: LIMIT,
    }),
    [],
  ));
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // open times
  const openTimes = useMemo(
    () => data?.map((record) => formatDate(record.open, 'datetime-medium')),
    [data],
  );

  // time distances
  const timeDistances = useMemo(
    () => data?.map(
      (record) => (
        record.close === null ? 'Position is running' : formatDistance(record.open, record.close)
      ),
    ),
    [data],
  );

  // pnl values
  const pnls = useMemo(() => data?.map((record) => formatPNL(record.pnl)), [data]);





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
              <button
                id={`pd-${record.id}`}
                className={`py-8 px-6 first:pt-3 flex justify-start items-center w-full text-left ${record.archived ? 'opacity-70' : ''} hover:bg-slate-100`}
                onClick={() => openPositionDialog(record.id)}
                aria-label='Display position'
              >
                <div
                  className='max-w-[60%] sm:max-w-[70%]'
                >
                  <p
                    className='font-medium truncate'
                  >{openTimes[i]}</p>
                  <p
                    className='text-light text-sm truncate'
                  >{timeDistances[i]}</p>
                </div>

                <span className='flex-1'></span>

                <Badge
                  className={`bg-stateless ${record.pnl > 0 ? 'bg-increase-1' : 'bg-decrease-1'}`}
                >
                  {pnls[i]}
                </Badge>
              </button>
              {i < data.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
        {
          (hasMore && data.length >= LIMIT)
          && <div
            className='py-5'
          >
            <LoadMoreButton
              loadMore={() => loadMore(
                { func: PositionService.listCompactPositions, args: [LIMIT, data.at(-1)!.open] },
                rowsRef.current!,
                `pd-${data.at(-1)!.id}`,
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
          <DialogTitle>Positions</DialogTitle>
          <DialogDescription>
            Active and closed positions managed by Balancer
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
export default PositionsDialog;
