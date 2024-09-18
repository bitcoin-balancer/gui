import { memo, useMemo } from 'react';
import { prettifyValue } from 'bignumber-utils';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { IBalances } from '@/shared/backend/exchange/index.service.ts';
import { BalanceService } from '@/shared/backend/position/balance/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Balances Dialog Component
 * Component in charge of displaying a price crash state record.
 */
const BalancesDialog = memo(({
  closeDialog,
}: {
  closeDialog: (nextState: undefined) => void,
}) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<IBalances>(useMemo(
    () => ({
      fetchFunc: { func: BalanceService.getBalances },
    }),
    [],
  ));
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // last time the balances were fetched
  const lastRefetch = useMemo(
    () => (data ? formatDate(data.refetchTime, 'datetime-medium') : ''),
    [data],
  );

  // the balances for both assets
  const baseBalance = useMemo(
    () => (data ? prettifyValue(data[exchangeConfig.baseAsset], { processing: { decimalPlaces: 8 } }) : ''),
    [exchangeConfig.baseAsset, data],
  );
  const quoteBalance = useMemo(
    () => (data ? prettifyValue(data[exchangeConfig.quoteAsset]!, { processing: { decimalPlaces: 2 } }) : ''),
    [exchangeConfig.quoteAsset, data],
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
    content = <div>
      <div
        className='flex justify-center items-center mt-1'
      >
        <p
          className='text-light'
        >{exchangeConfig.baseAsset}</p>
        <span className='flex-1'></span>
        <p
          className='text-xl'
        >
          {baseBalance}
        </p>
      </div>
      <div
        className='flex justify-center items-center mt-6'
      >
        <p
          className='text-light'
        >{exchangeConfig.quoteAsset}</p>
        <span className='flex-1'></span>
        <p
          className='text-xl'
        >
          {quoteBalance}
        </p>
      </div>
    </div>;
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent className='max-w-[400px]'>

        <DialogHeader>
          <DialogTitle>Balances</DialogTitle>
          <DialogDescription>
            {lastRefetch}
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
export default BalancesDialog;
