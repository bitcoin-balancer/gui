import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
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
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the opening time of the current bar
  const currentBar = useMemo(
    () => formatDate(windowState.window.id[windowState.window.id.length - 1], 'datetime-medium'),
    [windowState.window.id],
  );





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

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
    <Card>
      <CardHeader
        className='flex flex-col sm:flex-row justify-start items-start'
      >
        <Tooltip>
          <TooltipTrigger
            onClick={displayWindowInfo}
          >
            <CardTitle
              className='flex justify-start items-center gap-2'
            >
              Window
              <StateIcon state={windowState.state} />
            </CardTitle>
            <CardDescription>{currentBar}</CardDescription>
          </TooltipTrigger>
          <TooltipContent><p>More info</p></TooltipContent>
        </Tooltip>

        <span className='flex-1'></span>
        <div className='grid grid-cols-4 gap-2'>

        </div>
      </CardHeader>
      <CardContent>
        <CandlestickChart
          height={600}
          data={windowState.window}
          state={windowState.state}
        />
      </CardContent>
    </Card>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowState;
