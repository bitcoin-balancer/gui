import { Fragment, memo, useMemo, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PositionButton from '@/shared/components/position-button/index.component.tsx';
import LoadMoreButton from '@/shared/components/load-more-button/index.component.tsx';
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
 * Positions Dialog Component
 * Component in charge of displaying the positions.
 */
const PositionsDialog = memo(({ closeDialog }: { closeDialog: (nextState: undefined) => void }) => {
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
        fetchFn: () => PositionService.listCompactPositions(LIMIT),
        queryLimit: LIMIT,
      }),
      [],
    ),
  );
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);

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
              <PositionButton record={record} />
              {i < data.length - 1 && <Separator />}
            </Fragment>
          ))}
        </div>
        {hasMore && data.length >= LIMIT && (
          <div className="py-5">
            <LoadMoreButton
              loadMore={() =>
                loadMore(
                  () => PositionService.listCompactPositions(LIMIT, data.at(-1)!.open),
                  rowsRef.current!,
                  `pb-${data.at(-1)!.id}`,
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
          <DialogTitle>Positions</DialogTitle>
          <DialogDescription>Active and closed positions managed by Balancer</DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionsDialog;
