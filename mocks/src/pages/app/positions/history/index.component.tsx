import { memo, useMemo, Fragment } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card.tsx';
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

const MOCK_DATA = {
  id: [
    1727656817768, 1727743218545, 1727829618893, 1727916019439, 1728002421452, 1728138952202,
    1728225354292,
  ],
  low: [
    [62866.9, -3.73, 65306, 0.0008991],
    [60174, -7.86, 65306, 0.0008991],
    [60000, -8.12, 65306, 0.0008991],
    [59863.99, -7.84, 62876.03, 0.0008991],
    [60459.99, -3.84, 62876.03, 0.0017982],
    [61706, -1.86, 62876.03, 0.0017982],
    [62302, -0.91, 62876.03, 0.0013982],
  ],
  high: [
    [65544, 0.36, 65306, 0.0008991],
    [64130.29, -1.8, 65306, 0.0008991],
    [62366.7, -4.5, 65306, 0.0008991],
    [61477.19, -2.82, 65306, 0.0017982],
    [62484.85, -0.62, 62876.03, 0.0017982],
    [62439.81, -0.69, 62876.03, 0.0017982],
    [63968, 1.74, 62876.03, 0.0017982],
  ],
  open: [
    [65295.98, -0.02, 65306, 0.0008991],
    [63335.99, -3.02, 65306, 0.0008991],
    [61097.22, -6.44, 65306, 0.0008991],
    [61009.37, -6.58, 65306, 0.0008991],
    [60585.91, -3.64, 62876.03, 0.0017982],
    [62155.26, -1.15, 62876.03, 0.0017982],
    [62372, -0.8, 62876.03, 0.0017982],
  ],
  close: [
    [63330.01, -3.03, 65306, 0.0008991],
    [61096.01, -6.45, 65306, 0.0008991],
    [61024, -6.56, 65306, 0.0008991],
    [60598, -3.62, 62876.03, 0.0017982],
    [62361.14, -0.82, 62876.03, 0.0017982],
    [62372.01, -0.8, 62876.03, 0.0017982],
    [62992, 0.18, 62876.03, 0.0013982],
  ],
};

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
  const { data, loading, error } = useAPIFetch<IEventHistoryRecord>(
    useMemo(
      () => ({ fetchFunc: { func: PositionService.getPositionHistory, args: [position.id] } }),
      [position.id],
    ),
  );
  const breakpoint = useMediaQueryBreakpoint();

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the list of compact candlestick records
  const records = useMemo(() => CandlestickService.splitRecords(MOCK_DATA), []);

  // the list of markers that will be inserted into the price chart
  const markers = useMemo(
    () =>
      data === undefined
        ? []
        : buildPositionMarkers(
            data.records.id,
            [
              { txID: 1, eventTime: 1727656817759, nextEventTime: 1727916017759 },
              { txID: 2, eventTime: 1727944838676, nextEventTime: 1728204038676 },
            ],
            position.decrease_actions,
          ),
    [data, position],
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
    <div className="page-container flex justify-center items-start animate-in fade-in duration-700">
      <section className="w-full">
        {/* ********
         * HEADER *
         ******** */}
        <header className="flex justify-start items-center mb-5 lg:hidden">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2 lg:hidden"
            onClick={() => setSidenavOpen(true)}
            aria-label="Open Side Navigation"
          >
            <Menu aria-hidden="true" />
          </Button>

          <h1 className="text-2xl font-semibold leading-none tracking-tight">History</h1>
          <span className="flex-1"></span>
        </header>

        {/* *********
         * CONTENT *
         ********* */}
        {data.records.id.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-in fade-in duration-700">
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
                {i < records.length - 1 && (breakpoint === 'xs' || breakpoint === 'sm') && (
                  <Separator className="my-10 md:hidden" />
                )}
              </Fragment>
            ))}
          </div>
        ) : (
          <NoRecords />
        )}
      </section>
    </div>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default History;
