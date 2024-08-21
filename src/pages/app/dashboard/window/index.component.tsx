import { useMemo, useCallback, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { MarketStateService, ISplitStateID } from '@/shared/backend/market-state/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import SplitTileButton from '@/pages/app/dashboard/window/split-tile-button.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import WindowSplitStatesDialog, { IWindowStateDialogData } from './window-split-states-dialog/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/window/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window State Component
 * Component in charge of displaying the current state of the window.
 */
const WindowState = ({ windowState }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */



  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);
  const [activeDialog, setActiveDialog] = useState<IWindowStateDialogData | undefined>(undefined);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the opening time of the current bar
  const currentBar = useMemo(
    () => formatDate(
      windowState.window.id[windowState.window.id.length - 1],
      breakpoint === 'xs' || breakpoint === 'sm' ? 'time-medium' : 'datetime-medium',
    ),
    [breakpoint, windowState.window.id],
  );





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Opens the window state dialog an activates the split ID.
   * @param id
   */
  const openWindowStateDialog = (id: ISplitStateID): void => (
    setActiveDialog({ activeID: id, windowState })
  );

  /**
   * Closes the window state dialog.
   */
  const closeWindowStateDialog = useCallback(
    (): void => {
      setActiveDialog(undefined);
    },
    [],
  );

  /**
   * Displays the information dialog which describes how to the window module operates.
   */
  const displayWindowInfo = (): void => {
    openInfoDialog({
      title: 'Window',
      description: 'The Window Module employs a dynamic moving window that analyzes candlestick data to identify market trends.',
      content: [
        'CALCULATION',
        'The module calculates the window\'s state by applying eight distinct splits to the candlestick sequence. Each split represents a different time frame, providing insights into short-term and long-term trends.',
        'By default, the window utilizes 128 15-minute candlesticks, spanning approximately 32 hours. These splits are applied as follows:',
        '* 100% (128 items): last ~32 hours',
        '* 75% (96 items): last ~24 hours',
        '* 50% (64 items): last ~16 hours',
        '* 25% (32 items): last ~8 hours',
        '* 15% (20 items): last ~5 hours',
        '* 10% (13 items): last ~3.25 hours',
        '* 5% (7 items): last ~1.75 hours',
        '* 2% (3 items): last ~45 minutes',
        '-----',
        'STATE INTERPRETATION',
        'The window\'s state is categorized into five distinct levels, indicating the strength and direction of the trend:',
        '* 2: Increasing strongly - a clear upward trend with strong momentum',
        '* 1: Increasing - a positive trend, but with less intensity than "Increasing strongly"',
        '* 0: Sideways - a period of consolidation with no clear direction',
        '* -1: Decreasing - a negative trend with moderate downward momentum',
        '* -2: Decreasing strongly - a strong downward trend with significant downward momentum',
        '-----',
        'USES',
        'The Window Module plays a crucial role in triggering other modules based on detected market trends:',
        'Strong decrease (-2): when the window identifies a strong downward trend, it activates the Reversal Module. This module analyzes various indicators to determine potential opportunities for opening or increasing the position, seeking to capitalize on the reversal of the downward trend.',
        'Strong increase (2): conversely, when a strong upward trend is detected, the Position Module is triggered. This module assesses the current profit and loss (PnL) situation to determine if the position can be reduced, aiming to secure profits.',
        '-----',
        'The window module can be fully configured in the Adjustments/Window page, allowing you to tailor the analysis to your specific needs.',
      ],
    });
  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* *******************
        * WINDOW STATE CARD *
        ******************* */}
      <Card>
        <CardHeader
          className='flex flex-col md:flex-row justify-start'
        >
          <Tooltip>
            <TooltipTrigger
              onClick={displayWindowInfo}
              aria-label='Display information about how the Window Module works'
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
            </TooltipTrigger>
            <TooltipContent><p>More info</p></TooltipContent>
          </Tooltip>

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
          className='pt-5 md:pt-0'
        >
          <CandlestickChart
            height={580}
            data={windowState.window}
            state={windowState.state}
            prettifyY={true}
          />
        </CardContent>
      </Card>



      {/* *********************
        * WINDOW STATE DIALOG *
        ********************* */}
      {
        activeDialog !== undefined
        && <WindowSplitStatesDialog
          data={activeDialog}
          closeDialog={closeWindowStateDialog}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowState;