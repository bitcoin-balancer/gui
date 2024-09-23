import { subMonths, subYears } from 'date-fns';
import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Calendar, EllipsisVertical } from 'lucide-react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService, ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { IDateRange, IDateRangeID } from '@/pages/app/positions/types.ts';
import { Button } from '@/shared/shadcn/components/ui/button';

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
  const breakpoint = useMediaQueryBreakpoint();
  const navigate = useNavigate();





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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                {
                  (breakpoint === 'xs' || breakpoint === 'sm')
                    ? <Button
                      size='icon'
                      className='sm:hidden'
                    >
                      <Calendar className='w-5 h-5' aria-hidden='true' />
                    </Button>
                    : <Button
                      className='hidden sm:flex'
                    >
                      <Calendar className='mr-1 w-5 h-5' aria-hidden='true' />
                      Range: {range.label}
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

          
      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Positions;
