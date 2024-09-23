import { formatDistance } from 'date-fns';
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  CalendarClock,
  DollarSign,
  HandCoins,
  Menu,
  Percent,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * General
 * Component in charge of displaying general information about a position.
 */
const General = ({ position, setSidenavOpen }: IPositionComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const serverTime = useBoundStore((state) => state.serverTime!);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div
      className='page-container flex justify-center items-start animate-in fade-in duration-700'
    >

      <section
        className='w-full md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12'
      >
        {/* ********
          * HEADER *
          ******** */}
        <header
          className='flex justify-start items-center lg:hidden mb-5'
        >
          <Button
            variant='ghost'
            size='icon'
            className='mr-2'
            onClick={() => setSidenavOpen(true)}
            aria-label='Open Side Navigation'
          ><Menu aria-hidden='true' /></Button>
          <h1
            className='text-2xl font-semibold leading-none tracking-tight'
          >General</h1>
        </header>

        <div
          className='grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-10'
        >

          {/* ************
            * INVESTMENT *
            ************ */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                Investment
              </CardTitle>

              <DollarSign
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className='text-2xl font-bold'
              >
                {formatDollarAmount(position.amount_quote_in)}
              </p>
            </CardContent>
          </Card>

          <Separator className='md:hidden' />

          {/* **********
            * DURATION *
            ********** */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                Duration
              </CardTitle>

              <CalendarClock
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className='text-2xl font-bold truncate'
              >
                {formatDistance(position.open, position.close || serverTime)}
              </p>
            </CardContent>
          </Card>

          <Separator className='md:hidden' />

          {/* ******************
            * INCREASE ACTIONS *
            ****************** */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                Increased
              </CardTitle>

              <ArrowUpWideNarrow
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className='text-2xl font-bold'
              >
                {position.increase_actions.length} times
              </p>
            </CardContent>
          </Card>

          <Separator className='md:hidden' />

          {/* ******************
            * DECREASE ACTIONS *
            ****************** */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                Decreased
              </CardTitle>

              <ArrowDownWideNarrow
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className='text-2xl font-bold'
              >
                {position.decrease_actions.flat().length} times
              </p>
            </CardContent>
          </Card>

          <Separator className='md:hidden' />

          {/* *****
            * PNL *
            ***** */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                PNL
              </CardTitle>

              <HandCoins
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className={`text-2xl font-bold ${position.pnl > 0 ? 'text-increase-1' : 'text-decrease-1'}`}
              >
                {position.pnl > 0 ? '+' : ''}{formatDollarAmount(position.pnl)}
              </p>
            </CardContent>
          </Card>

          <Separator className='md:hidden' />

          {/* *****
            * ROI *
            ***** */}
          <Card>
            <CardHeader
              className='flex flex-row items-center justify-between'
            >
              <CardTitle
                className='text-base font-medium'
              >
                ROI
              </CardTitle>

              <Percent
                aria-hidden='true'
                className='h-6 w-6 text-light'
              />
            </CardHeader>

            <CardContent>
              <p
                className={`text-2xl font-bold ${PositionService.getGainClassName(position!.roi)}`}
              >
                {formatPercentageChange(position.roi)}
              </p>
            </CardContent>
          </Card>

        </div>

      </section>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default General;
