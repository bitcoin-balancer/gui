import { subMonths, subYears } from 'date-fns';
import { useMemo, useState, Fragment } from 'react';
import {
  Calendar,
  List,
  DollarSign,
  HandCoins,
  Percent,
} from 'lucide-react';
import { isArrayValid } from 'web-utils-kit';
import { calculateMean, getBigNumber, processValue } from 'bignumber-utils';
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/shared/shadcn/components/ui/card.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  formatBadgeCount,
  formatDollarAmount,
  formatPercentageChange,
  formatPNL,
} from '@/shared/services/transformers/index.service.ts';
import { ISplitStateItem, IState } from '@/shared/backend/market-state/shared/types.ts';
import { PositionService, ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import PositionButton from '@/shared/components/position-button/index.component.tsx';
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

/**
 * Retrieves the state of a data item based on its value.
 * @param value
 * @returns IState
 */
const getValueState = (value: number): IState => {
  if (value > 0) {
    return 1;
  }
  if (value < 0) {
    return -1;
  }
  return 0;
};

/**
 * Processes a list of unarchived positions and retrieves the data needed to render the view.
 * @param positions
 * @returns IProcessedPositions
 */
const processPositions = (positions: ICompactPosition[] | undefined): IProcessedPositions => {
  // init values
  let pnlAccum = getBigNumber(0);
  const pnlChart: ISplitStateItem[] = [];
  const roi: number[] = [];
  const roiChart: ISplitStateItem[] = [];
  const investments: number[] = [];
  const investmentsChart: ISplitStateItem[] = [];

  // iterate over each position
  if (isArrayValid(positions)) {
    positions.forEach((pos) => {
      if (!pos.archived) {
        pnlAccum = pnlAccum.plus(pos.pnl);
        pnlChart.push({ x: pos.open, y: processValue(pnlAccum) });
        roi.push(pos.roi);
        roiChart.push({ x: pos.open, y: pos.roi });
        investments.push(pos.amount_quote_in);
        investmentsChart.push({ x: pos.open, y: pos.amount_quote_in });
      }
    });
  }

  // calculate the values
  const pnlValue = pnlAccum.toNumber();
  const roiMean = calculateMean(roi);
  const investmentsMean = calculateMean(investments);

  // finally, return the build
  return {
    pnlState: getValueState(pnlValue),
    pnl: formatPNL(pnlValue),
    pnlClass: PositionService.getPNLClassName(pnlAccum.toNumber()),
    roiState: getValueState(roiMean),
    roi: formatPercentageChange(roiMean),
    roiClass: PositionService.getGainClassName(roiMean),
    investments: formatDollarAmount(investmentsMean),
    pnlChart,
    roiChart,
    investmentsChart,
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
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  /**
   * Reversed list of records and computable values that will be displayed in the dialog
   */
  const records = useMemo(() => (Array.isArray(data) ? [...data].reverse() : []), [data]);

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
        className='w-full lg:w-10/12 xl:w-9/12 2xl:w-8/12'
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
            {
              processed.pnlChart.length > 0
              && <Badge
                className='ml-1 -mt-4'
              >
                {formatBadgeCount(processed.pnlChart.length, 99)}
              </Badge>
            }

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
                  {
                    records.length > 0
                      ? records.map((record, i) => (
                        <Fragment key={record.id}>
                          <PositionButton record={record} />
                          {i < data.length - 1 && <Separator />}
                        </Fragment>
                      ))
                      : <NoRecords />
                  }
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
                      disabled={processed.pnlChart.length === 0}
                    >
                      <Calendar className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    : <Button
                      disabled={processed.pnlChart.length === 0}
                    >
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
          {
            processed.pnlChart.length > 0
              ? <>
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
                          className={`text-2xl font-bold ${processed.pnlClass} truncate`}
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
                          className='text-base font-medium truncate'
                        >
                          Avg. ROI
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
                          className={`text-2xl font-bold ${processed.roiClass} truncate`}
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
                          className='text-base font-medium truncate'
                        >
                          Avg. Investment
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

                <div
                  className='mt-5'
                >
                  {
                    activeChart === 'pnl'
                    && <div
                      className='animate-in fade-in duration-700'
                    >
                      <LineChart
                        kind='area'
                        height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
                        data={processed.pnlChart}
                        state={processed.pnlState}
                      />
                    </div>
                  }

                  {
                    activeChart === 'roi'
                    && <div
                      className='animate-in fade-in duration-700'
                    >
                      <LineChart
                        kind='area'
                        height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
                        data={processed.roiChart}
                        state={processed.roiState}
                      />
                    </div>
                  }

                  {
                    activeChart === 'investments'
                    && <div
                      className='animate-in fade-in duration-700'
                    >
                      <LineChart
                        kind='area'
                        height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
                        data={processed.investmentsChart}
                      />
                    </div>
                  }
                </div>
              </>
              : <NoRecords />
          }
        </article>
      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Positions;
