import {
  useMemo,
  useState,
  useRef,
  useEffect,
  useCallback,
} from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { ISplitStateID } from '@/shared/backend/market-state/shared/types.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
import { formatDate, formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import SplitTileButton from '@/pages/app/dashboard/window/split-tile-button.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/window/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the height of the mobile chart in pixels
const MOBILE_CHART_HEIGHT = 350;





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Prettifies the current bar's timestamp.
 * @param openTime
 * @param breakpoint
 * @returns string
 */
const formatCurrentBarOpenTime = (openTime: number, breakpoint: IBreakpoint): string => formatDate(
  openTime,
  breakpoint === 'xs' || breakpoint === 'sm' ? 'time-medium' : 'datetime-medium',
);




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window State Component
 * Component in charge of displaying the current state of the window.
 */
const WindowState = ({ windowState, openSplitStatesDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const chartContainerRef = useRef<HTMLDivElement | null>(null);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const [chartHeight, setChartHeight] = useState<number>();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the opening time of the current bar
  const currentBar = useMemo(
    () => formatCurrentBarOpenTime(
      windowState.window.id[windowState.window.id.length - 1],
      breakpoint,
    ),
    [breakpoint, windowState.window.id],
  );

  // the price formatter that will be used on the chart
  const priceFormatter = useCallback((value: number) => formatDollarAmount(value, 0), []);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Calculates the height of the chart based on the size of the card.
   */
  useEffect(() => {
    if (breakpoint === 'xs' || breakpoint === 'sm') {
      setChartHeight(MOBILE_CHART_HEIGHT);
    } else {
      setChartHeight(chartContainerRef.current!.clientHeight);
    }
  }, [breakpoint]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Opens the window state dialog an activates the split ID.
   * @param id
   */
  const openWindowStateDialog = (id: ISplitStateID): void => (
    openSplitStatesDialog({
      moduleID: 'WINDOW',
      activeID: id,
      moduleState: {
        state: windowState.state,
        splitStates: windowState.splitStates,
        window: toSplitStateItems(windowState.window),
      },
    })
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card
      className='h-full flex flex-col'
    >
      <CardHeader
        className='flex flex-col md:flex-row justify-start'
      >
        <div
          className='flex flex-row justify-start items-center md:flex-col md:justify-start md:items-start'
        >
          <CardTitle
            className='flex justify-start items-center gap-2'
          >
            Window
            <StateIcon state={windowState.state} />
          </CardTitle>

          <span className='flex-1 md:hidden'></span>

          <CardDescription>{currentBar}</CardDescription>
        </div>

        <span
          className='flex-1 hidden md:inline'
        ></span>

        <div
          className='grid grid-cols-4 gap-1 pt-3 md:pt-0 w-full md:w-7/12 xl:w-6/12 2xl:w-5/12'
        >
          {MarketStateService.SPLITS.map((split) => (
            <SplitTileButton
              key={split}
              id={split}
              split={windowState.splitStates[split]}
              displayWindowDialog={() => openWindowStateDialog(split)}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent
        ref={chartContainerRef}
        className='pt-5 md:pb-0 md:pt-0 flex-1'
      >
        {
          chartHeight !== undefined
          && <CandlestickChart
            height={chartHeight}
            data={windowState.window}
            state={windowState.state}
            priceFormatterFunc={priceFormatter}
          />
        }
      </CardContent>
    </Card>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowState;
