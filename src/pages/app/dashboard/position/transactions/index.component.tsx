import { memo, useMemo, useRef, Fragment } from 'react';
import { CircleCheck, CircleX, Loader2 } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { TransactionService } from '@/shared/backend/position/transaction/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
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
 * Transactions Dialog Component
 * Component in charge of displaying the transactions.
 */
const TransactionsDialog = memo(
  ({ closeDialog }: { closeDialog: (nextState: undefined) => void }) => {
    /* **********************************************************************************************
     *                                             REFS                                             *
     ********************************************************************************************** */
    const rowsRef = useRef<HTMLDivElement | null>(null);

    /* **********************************************************************************************
     *                                             STATE                                            *
     ********************************************************************************************** */
    const { data, loading, error, hasMore, loadMore, loadingMore } = useAPIFetch(
      useMemo(
        () => ({
          fetchFn: () => TransactionService.listTransactions(LIMIT),
          queryLimit: LIMIT,
        }),
        [],
      ),
    );
    const openTransactionDialog = useBoundStore((state) => state.openTransactionDialog);
    const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);

    /* **********************************************************************************************
     *                                       REACTIVE VALUES                                        *
     ********************************************************************************************** */

    // event times
    const eventTimes = useMemo(
      () => data?.map((record) => formatDate(record.event_time, 'datetime-medium')),
      [data],
    );

    /* **********************************************************************************************
     *                                           COMPONENT                                          *
     ********************************************************************************************** */
    let content;
    if (error) {
      content = (
        <div className="pb-5">
          <PageLoadError
            variant="dialog"
            error={error}
          />
        </div>
      );
    } else if (loading) {
      content = <PageLoader variant="dialog" />;
    } else if (data.length) {
      content = (
        <>
          <div ref={rowsRef}>
            {data.map((record, i) => (
              <Fragment key={record.id}>
                <button
                  id={`txd-${record.id}`}
                  className="p-6 flex justify-start items-center w-full text-left hover:bg-slate-100"
                  onClick={() => openTransactionDialog(record)}
                  aria-label="Display transaction"
                >
                  <div className="max-w-[70%] sm:max-w-[85%]">
                    <p
                      className={`font-semibold ${record.side === 'BUY' ? 'text-increase-1' : 'text-decrease-1'}`}
                    >
                      {record.side === 'BUY' ? 'Increase' : 'Decrease'}
                    </p>
                    <p className="text-light text-sm truncate">{eventTimes[i]}</p>
                  </div>

                  <span className="flex-1"></span>

                  {record.status === 'PROCESSING' && (
                    <Loader2
                      aria-hidden="true"
                      className="ml-2 h-4 w-4 animate-spin"
                    />
                  )}
                  {record.status === 'FAILED' && (
                    <CircleX
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 text-error"
                    />
                  )}
                  {record.status === 'SUCCEEDED' && (
                    <CircleCheck
                      aria-hidden="true"
                      className="ml-2 h-5 w-5 text-success"
                    />
                  )}
                </button>
                {i < data.length - 1 && <Separator />}
              </Fragment>
            ))}
          </div>
          {hasMore && data.length >= LIMIT && (
            <div className="py-5">
              <LoadMoreButton
                loadMore={() =>
                  loadMore(
                    () => TransactionService.listTransactions(LIMIT, data.at(-1)!.id),
                    rowsRef.current!,
                    `txd-${data.at(-1)!.id}`,
                  )
                }
                loadingMore={loadingMore}
              />
            </div>
          )}
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
        <DialogContent className="p-0">
          <DialogHeader className="p-6 pb-0">
            <DialogTitle>Transactions</DialogTitle>
            <DialogDescription>
              Increase & decrease actions executed and confirmed by Balancer
            </DialogDescription>
          </DialogHeader>

          {content}
        </DialogContent>
      </Dialog>
    );
  },
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default TransactionsDialog;
