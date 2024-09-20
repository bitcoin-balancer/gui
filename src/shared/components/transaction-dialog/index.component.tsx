import { memo, useState, useEffect } from 'react';
import {
  Braces,
  Check,
  CircleX,
  Loader2,
} from 'lucide-react';
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import {
  TransactionService,
  ITransactionStatus,
  ITransactionActionName,
  ITransaction,
} from '@/shared/backend/position/transaction/index.service.ts';
import { formatBitcoinAmount, formatDate } from '@/shared/services/transformers/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the actions that are executed when a transaction is created
const LOG_ACTIONS: Record<ITransactionActionName, string> = {
  INITIAL_BALANCES: 'Retrieve a snapshot of the balances from the exchange',
  EXECUTION: 'Build and send the transaction to the exchange',
  CONFIRMATION: 'Retrieve another balance snapshot from the exchange and compare it against the initial one',
};





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Retrieves the icon that quickly shows the result of the transaction.
 * @param status
 * @returns JSX.Element
 */
const getStatusIcon = (status: ITransactionStatus | undefined): JSX.Element => {
  switch (status) {
    case 'SUCCEEDED':
      return <Check aria-hidden='true' className='ml-2 h-5 w-5 text-success' />;
    case 'FAILED':
      return <CircleX aria-hidden='true' className='ml-2 h-5 w-5 text-error' />;
    default:
      return <Loader2 aria-hidden='true' className='ml-2 h-4 w-4 animate-spin' />;
  }
};

/**
 * Retrieves the className that will be applied to the dialog's description.
 * @param status
 * @returns string
 */
const getStatusClass = (status: ITransactionStatus | undefined): string => {
  switch (status) {
    case 'SUCCEEDED':
      return 'text-success';
    case 'FAILED':
      return 'text-error';
    default:
      return 'text-light';
  }
};

/**
 * Retrieves the text that will be placed in the dialog's description.
 * @param status
 * @returns string
 */
const getStatusDescription = (status: ITransactionStatus | undefined): string => {
  switch (status) {
    case 'SUCCEEDED':
      return 'Executed successfully';
    case 'FAILED':
      return 'Failed to execute';
    default:
      return 'Processing...';
  }
};





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
  const closeTransactionDialog = useBoundStore((state) => state.closeTransactionDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeTransactionDialog);





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
          <p>{tx!.id}</p>
        </div>

        <div
          className='flex justify-center items-start mt-5'
        >
          <p
            className='text-light text-sm'
          >Event time</p>
          <span className='flex-1'></span>
          <p
              className='max-w-[50%] sm:max-w-[70%] truncate'
            >{formatDate(tx!.event_time, 'datetime-medium')}</p>
        </div>

        <div
          className='flex justify-center items-start mt-5'
        >
          <p
            className='text-light text-sm'
          >Amount</p>
          <span className='flex-1'></span>
          <p>{formatBitcoinAmount(tx!.amount)}</p>
        </div>

        <div className='relative border-l border-gray-200 mt-5'>
          {tx!.logs.map((log, i) => (
            <div
              key={i}
              className='mb-8 last:mb-0 ml-4'
            >
              {
                log.payload !== undefined
                && <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant='outline'
                      size='icon'
                      className='float-right mt-1'
                    >
                      <Braces aria-hidden='true' className='w-4 h-4' />
                    </Button>
                  </DialogTrigger>

                  <DialogContent
                    className='max-w-[550px]'
                  >
                    <DialogHeader>
                      <DialogTitle>{log.action}</DialogTitle>
                      <DialogDescription></DialogDescription>
                    </DialogHeader>
                    <div
                      className='overflow-x-auto p-5 rounded-lg bg-slate-900 text-slate-50 text-sm'
                    >
                      <pre>
                        {JSON.stringify(log.payload, null, 2)}
                      </pre>
                    </div>
                  </DialogContent>
                </Dialog>
              }

              <div
                className={`absolute w-3 h-3 rounded-full mt-1.5 -left-1.5 border border-white ${log.outcome ? 'bg-success' : 'bg-error'}`}
              ></div>
              <time
                className='text-sm font-semibold leading-none text-light'>
                  {formatDate(log.eventTime, 'datetime-medium')}
              </time>
              <h3
                className='text-sm font-semibold'
              >{log.action}</h3>
              {
                log.error === undefined
                  ? <p
                    className='text-sm font-normal text-light'
                  >{LOG_ACTIONS[log.action]}</p>
                  : <p
                    className='text-sm font-normal text-error'
                  >{log.error}</p>
              }
            </div>
          ))}
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
          <div
            className='flex justify-center sm:justify-start items-center'
          >
            <DialogTitle>{tx?.side === 'BUY' ? 'Increase' : 'Decrease'} Transaction</DialogTitle>
            {getStatusIcon(tx?.status)}
          </div>
          <DialogDescription
            className={getStatusClass(tx?.status)}
          >{getStatusDescription(tx?.status)}</DialogDescription>
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
