import { memo, useMemo, Fragment } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import {
  CandlestickService,
  IEventHistoryRecord,
} from '@/shared/backend/candlestick/index.service.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { buildPositionMarkers } from '@/pages/app/positions/position/history/utils.ts';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of charts that show the history of a position
const CHART_NAMES = ['Price', 'Gain', 'Entry price', 'Amount'];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * History
 * Component in charge of displaying the history of a position in OHLC format.
 */
const History = memo(({ position, setSidenavOpen }: IPositionComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch<IEventHistoryRecord>(useMemo(
    () => ({ fetchFunc: { func: PositionService.getPositionHistory, args: [position.id] } }),
    [position.id],
  ));
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the list of compact candlestick records
  const records = useMemo(() => CandlestickService.splitRecords(data?.records), [data]);

  // the list of markers that will be inserted into the price chart
  const markers = useMemo(
    () => buildPositionMarkers(position.increase_actions, position.decrease_actions),
    [position],
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
        className='w-full'
      >
        {/* ********
          * HEADER *
          ******** */}
        <header
          className='flex justify-start items-center mb-5 lg:hidden'
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
          >History</h1>
          <span className='flex-1'></span>
        </header>



        {/* *********
          * CONTENT *
          ********* */}
        {
          data.records.id.length > 0
            ? (
              <div
                className='grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700'
              >
                {records.map((record, i) => (
                  <Fragment key={i}>
                    <Card>
                      <CardHeader>
                        <CardTitle>{CHART_NAMES[i]}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CandlestickChart
                          height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 375}
                          data={record}
                          markers={i === 0 ? markers : undefined}
                        />
                      </CardContent>
                    </Card>
                    {
                      (i < records.length - 1 && (breakpoint === 'xs' || breakpoint === 'sm'))
                      && <Separator className='my-10 md:hidden' />
                    }
                  </Fragment>
                ))}
              </div>
            )
            : <NoRecords />
        }
      </section>

    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default History;
