import { memo, useMemo, Fragment } from 'react';
import { Menu } from 'lucide-react';
import { UTCTimestamp } from 'lightweight-charts';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { sortRecords } from '@/shared/services/utils/index.service.ts';
import {
  CandlestickService,
  IEventHistoryRecord,
} from '@/shared/backend/candlestick/index.service.ts';
import {
  PositionService,
  IPositionAction,
  IDecreaseActions,
} from '@/shared/backend/position/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import CandlestickChart, {
  IMarker,
} from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of charts that show the history of a position
const CHART_NAMES = ['Price', 'Gain', 'Entry price', 'Amount'];




/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds a marker object based on an action.
 * @param action
 * @param isIncrease
 * @returns IMarker
 */
const buildMarker = (action: IPositionAction, isIncrease: boolean): IMarker => ({
  time: action.eventTime as UTCTimestamp,
  position: isIncrease ? 'belowBar' : 'aboveBar',
  color: isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
  shape: isIncrease ? 'arrowUp' : 'arrowDown',
  text: isIncrease ? 'Increase' : 'Decrease',
});

/**
 * Builds the markers for the increase actions
 * @param actions
 * @returns IMarker[]
 */
const buildIncreaseMarkers = (actions: IPositionAction[]): IMarker[] => actions.map(
  (action) => buildMarker(action, true),
);

/**
 * Builds the markers for the decrease actions.
 * @param decreaseActions
 * @returns IMarker[]
 */
const buildDecreaseMarkers = (actions: IDecreaseActions): IMarker[] => actions.flat().map(
  (action) => buildMarker(action, false),
);

/**
 * Builds the markers for all the actions that have taken place.
 * @param increaseActions
 * @param decreaseActions
 * @returns IMarker[]
 */
const buildPositionMarkers = (
  increaseActions: IPositionAction[],
  decreaseActions: IDecreaseActions,
): IMarker[] => [
  ...buildIncreaseMarkers(increaseActions),
  ...buildDecreaseMarkers(decreaseActions),
].sort(sortRecords('time', 'asc'));





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
