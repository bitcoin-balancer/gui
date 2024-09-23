import { formatDistance, subMonths, subYears } from 'date-fns';
import { useMemo, useState, Fragment } from 'react';
import { Calendar, List } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService, ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { IDateRange, IDateRangeID } from '@/pages/app/positions/types.ts';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card';
import { formatDate, formatPNL } from '@/shared/services/transformers/index.service';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of accepted date ranges
const DATE_RANGES: IDateRange[] = [
  { id: '1m', label: '1 month' },
  { id: '3m', label: '3 months' },
  { id: '6m', label: '6 months' },
  { id: '1y', label: '1 year' },
  { id: '2y', label: '2 years' },
  { id: '3y', label: '3 years' },
  { id: '4y', label: '4 years' },
  { id: '5y', label: '5 years' },
];





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Calculates the starting point for a given range.
 * @param id
 * @returns number
 */
const calculateStartAt = (id: IDateRangeID): number => {
  switch (id) {
    case '1m':
      return subMonths(new Date(), 1).getTime();
    case '3m':
      return subMonths(new Date(), 3).getTime();
    case '6m':
      return subMonths(new Date(), 6).getTime();
    case '1y':
      return subYears(new Date(), 1).getTime();
    case '2y':
      return subYears(new Date(), 2).getTime();
    case '3y':
      return subYears(new Date(), 3).getTime();
    case '4y':
      return subYears(new Date(), 4).getTime();
    default:
      return subYears(new Date(), 5).getTime();
  }
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Positions Component
 * Component in charge of displaying Balancer's performance within a date range.
 */
const Positions = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [range, setRange] = useState<IDateRange>({ id: '1y', label: '1 year' });
  const { data, loading, error } = useAPIFetch<ICompactPosition[]>(useMemo(
    () => ({
      fetchFunc: {
        func: PositionService.listCompactPositionsByRange,
        args: [calculateStartAt(range.id)],
      },
    }),
    [range],
  ));
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // reversed list of records that will be displayed in the dialog
  const records = useMemo(() => (Array.isArray(data) ? [...data].reverse() : []), [data]);
  const openTimes = useMemo(
    () => (
      Array.isArray(records)
        ? records.map((record) => formatDate(record.open, 'datetime-medium'))
        : []
    ),
    [records],
  );
  const timeDistances = useMemo(
    () => (
      Array.isArray(records)
        ? records.map(
          (record) => (
            record.close === null ? 'Running...' : formatDistance(record.open, record.close)
          ),
        )
        : []
    ),
    [records],
  );
  const pnls = useMemo(
    () => (
      Array.isArray(records)
        ? records.map((record) => formatPNL(record.pnl))
        : []
    ),
    [records],
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
        className='w-full lg:w-9/12 xl:w-7/12 2xl:w-6/12'
      >
        {/* ********
          * HEADER *
          ******** */}
          <header
            className='flex justify-start items-center'
          >
            <h1
              className='text-2xl font-semibold leading-none tracking-tight'
            >Positions</h1>

            <span className='flex-1'></span>

            {/* *********
              * RECORDS *
              ********* */}
            <Dialog>
              <DialogTrigger asChild>
              {
                  (breakpoint === 'xs' || breakpoint === 'sm')
                    ? <Button
                      variant='outline'
                      size='icon'
                      className='mr-2'
                    >
                      <List className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    : <Button
                      variant='outline'
                      className='mr-2'
                    >
                      <List className='mr-1 w-5 h-5' aria-hidden='true' />
                      Records
                    </Button>
                }
              </DialogTrigger>
              <DialogContent className='p-0'>
                <DialogHeader className='p-6 pb-0'>
                  <DialogTitle>Positions</DialogTitle>
                  <DialogDescription>
                    List of records within the range
                  </DialogDescription>
                </DialogHeader>

                <div>
                  {data.map((record, i) => (
                    <Fragment key={record.id}>
                      <button
                        id={`pd-${record.id}`}
                        className={`p-6 flex justify-start items-center w-full text-left ${record.archived ? 'opacity-50' : ''} hover:bg-slate-100`}
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
              </DialogContent>
            </Dialog>

            {/* ************
              * RANGE MENU *
              ************ */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {
                  (breakpoint === 'xs' || breakpoint === 'sm')
                    ? <Button
                      size='icon'
                    >
                      <Calendar className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    : <Button>
                      <Calendar className='mr-1 w-5 h-5' aria-hidden='true' />
                      {range.label}
                    </Button>
                }
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                {DATE_RANGES.map((dateRange) => (
                  <DropdownMenuItem
                    key={dateRange.id}
                    onClick={() => setRange(dateRange)}
                    disabled={range.id === dateRange.id}
                  >
                    {dateRange.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </header>



        {/* *********
          * CONTENT *
          ********* */}
        <article>
          <Card>

            <CardContent>

            </CardContent>
          </Card>
        </article>

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Positions;
