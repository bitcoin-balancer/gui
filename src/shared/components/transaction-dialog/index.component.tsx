import { memo, useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import { TransactionService, ITransaction } from '@/shared/backend/position/transaction/index.service.ts';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Transaction Dialog Component
 * Component in charge of displaying transaction details.
 */
const TransactionDialog = memo(({ data }: { data: number | ITransaction }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [tx, setTX] = useState<ITransaction>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const closePositionDialog = useBoundStore((state) => state.closePositionDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closePositionDialog);



  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Retrieves and sets the requested tx. If the record was passed, it sets it right away.
   */
  useEffect(
    () => {
      let ignore = false;

      const fetchPosition = async () => {
        try {
          const value = typeof data === 'number' ? await TransactionService.getTransaction(data) : data;
          if (!ignore) {
            setTX(value);
            setLoading(false);
            setError(undefined);
          }
        } catch (e) {
          setError(e as Error);
        }
      };

      fetchPosition();

      return () => { ignore = true; };
    },
    [data],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
      <article>
        <div
          className='flex justify-center items-start'
        >
          <p
            className='text-light text-sm'
          >ID</p>
          <span className='flex-1'></span>
          <Badge
            variant='outline'
          >
            {tx?.id}
          </Badge>
        </div>

        <div
          className='flex justify-center items-start'
        >
          <p
            className='text-light text-sm'
          >Event time</p>
          <span className='flex-1'></span>
          <p
              className='max-w-[50%] sm:max-w-[70%] truncate'
            >{formatDate(tx!.event_time, 'datetime-medium')}</p>
        </div>
      </article>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Transaction</DialogTitle>
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
export default TransactionDialog;
