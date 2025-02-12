import { memo, useMemo, Fragment } from 'react';
import {
  CircleCheck,
  CircleX,
  Loader2,
  Menu,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Transactions
 * Component in charge of displaying the transactions that took place in a position.
 */
const Transactions = memo(({ position, setSidenavOpen }: IPositionComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => PositionService.listPositionTransactions(position.id),
    }),
    [position.id],
  ));
  const openTransactionDialog = useBoundStore((state) => state.openTransactionDialog);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the prettified dates in which the tx was executed
  const dates = useMemo(
    () => (
      Array.isArray(data)
        ? data.map((record) => formatDate(record.event_time, 'datetime-medium'))
        : []
    ),
    [data],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (error) {
    return <PageLoadError error={error} />;
  }
  if (loading) {
    return <PageLoader />;
  }
  return (
    <div
      className='page-container flex justify-center items-start animate-in fade-in duration-700'
    >

      <section
        className='w-full md:w-8/12 lg:w-7/12 xl:w-6/12 2xl:w-5/12'
      >
        {/* ********
          * HEADER *
          ******** */}
        <header
          className='flex justify-start items-center mb-5'
        >
          <Button
            variant='ghost'
            size='icon'
            className='mr-2 lg:hidden'
            onClick={() => setSidenavOpen(true)}
            aria-label='Open Side Navigation'
          ><Menu aria-hidden='true' /></Button>

          <h1
            className='text-2xl font-semibold leading-none tracking-tight'
          >Transactions</h1>
          <span className='flex-1'></span>
        </header>



        {/* *********
          * CONTENT *
          ********* */}
        {
          data.length > 0
            ? <Card>
            <CardContent
              className='pt-0 md:p-0'
            >
              {data.map((record, i) => (
                <Fragment key={record.id}>
                <button
                  id={`txd-${record.id}`}
                  className='p-6 flex justify-start items-center w-full text-left hover:bg-slate-100'
                  onClick={() => openTransactionDialog(record)}
                  aria-label='Display transaction'
                >
                  <div
                    className='max-w-[70%] sm:max-w-[85%]'
                  >
                    <p
                      className={`font-semibold ${record.side === 'BUY' ? 'text-increase-1' : 'text-decrease-1'}`}
                    >{record.side === 'BUY' ? 'Increase' : 'Decrease'}</p>
                    <p
                      className='text-light text-sm truncate'
                    >{dates[i]}</p>
                  </div>

                  <span className='flex-1'></span>

                  {record.status === 'PROCESSING' && <Loader2 aria-hidden='true' className='ml-2 h-4 w-4 animate-spin' />}
                  {record.status === 'FAILED' && <CircleX aria-hidden='true' className='ml-2 h-5 w-5 text-error' />}
                  {record.status === 'SUCCEEDED' && <CircleCheck aria-hidden='true' className='ml-2 h-5 w-5 text-success' />}
                </button>
                {i < data.length - 1 && <Separator />}
              </Fragment>
              ))}
            </CardContent>
          </Card>
            : <NoRecords />
        }
      </section>

    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Transactions;
