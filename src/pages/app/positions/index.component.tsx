import { formatDistance, subMonths, subYears } from 'date-fns';
import { useMemo, useState, Fragment } from 'react';
import {
  Calendar,
  List,
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  CalendarClock,
  DollarSign,
  HandCoins,
  Menu,
  Percent,
} from 'lucide-react';
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
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  formatDate,
  formatPNL,
} from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService, ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import {
  IDateRange,
  IDateRangeID,
  IProcessedPositions,
} from '@/pages/app/positions/types.ts';

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

// eslint-disable-next-line padded-blocks, arrow-body-style
const processPositions = (positions: ICompactPosition[]): IProcessedPositions => {


  // finally, return the build
  return {
    pnl: '+$1,855.96',
    pnlClass: 'text-increase-1',
    roi: '+15%',
    roiClass: 'text-increase-1',
    investments: '$10,555.85',
    pnlChart: [],
    roiChart: [],
    investmentsChart: [],
  };
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
  const [activeChart, setActiveChart] = useState<'pnl' | 'roi' | 'investments'>('pnl');
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  /**
   * Reversed list of records and computable values that will be displayed in the dialog
   */
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

  /**
   * List of records that have not been archived as well as the computable values.
   */
  const processed = useMemo(() => processPositions(data), [data]);





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
                  {records.map((record, i) => (
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
        <article
          className='mt-5'
        >

          <header
            className='flex flex-col sm:flex-row justify-center items-center gap-4'
          >

            {/* *****
              * PNL *
              ***** */}
            <button
              onClick={() => setActiveChart('pnl')}
              disabled={activeChart === 'pnl'}
              className='flex-1 w-full text-left'
            >
              <Card
                className={`border-solid shadow-sm hover:bg-slate-50 ${activeChart === 'pnl' ? 'bg-slate-50 cursor-not-allowed' : ''}`}
              >
                <CardHeader
                  className='p-4 flex flex-row items-center justify-between'
                >
                  <CardTitle
                    className='text-base font-medium'
                  >
                    PNL
                  </CardTitle>

                  <HandCoins
                    aria-hidden='true'
                    className='h-5 w-5 md:h-6 md:w-6'
                  />
                </CardHeader>

                <CardContent
                  className='p-4'
                >
                  <p
                    className={`text-2xl font-bold ${processed.pnlClass}`}
                  >{processed.pnl}</p>
                </CardContent>
              </Card>
            </button>

            {/* *****
              * ROI *
              ***** */}
            <button
              onClick={() => setActiveChart('roi')}
              disabled={activeChart === 'roi'}
                className='flex-1 w-full text-left'
            >
              <Card
                className={`border-solid shadow-sm hover:bg-slate-50 ${activeChart === 'roi' ? 'bg-slate-50 cursor-not-allowed' : ''}`}
              >
                <CardHeader
                  className='p-4 flex flex-row items-center justify-between'
                >
                  <CardTitle
                    className='text-base font-medium'
                  >
                    ROI
                  </CardTitle>

                  <Percent
                    aria-hidden='true'
                    className='h-5 w-5 md:h-6 md:w-6'
                  />
                </CardHeader>

                <CardContent
                  className='p-4'
                >
                  <p
                    className={`text-2xl font-bold ${processed.roiClass}`}
                  >
                    {processed.roi}
                  </p>
                </CardContent>
              </Card>
            </button>

            {/* *************
              * INVESTMENTS *
              ************* */}
            <button
              onClick={() => setActiveChart('investments')}
              disabled={activeChart === 'investments'}
              className='flex-1 w-full text-left'
            >
              <Card
                className={`border-solid shadow-sm hover:bg-slate-50 ${activeChart === 'investments' ? 'bg-slate-50 cursor-not-allowed' : ''}`}
              >
                <CardHeader
                  className='p-4 flex flex-row items-center justify-between'
                >
                  <CardTitle
                    className='text-base font-medium'
                  >
                    Investments
                  </CardTitle>

                  <DollarSign
                    aria-hidden='true'
                    className='h-5 w-5 md:h-6 md:w-6'
                  />
                </CardHeader>

                <CardContent
                  className='p-4'
                >
                  <p
                    className='text-2xl font-bold'
                  >
                    {processed.investments}
                  </p>
                </CardContent>
              </Card>
            </button>
          </header>

          <div>
            {
              activeChart === 'pnl'
              && <p>PNL</p>
            }

            {
              activeChart === 'roi'
              && <p>ROI</p>
            }

            {
              activeChart === 'investments'
              && <p>Investments</p>
            }
          </div>
        </article>
      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Positions;
