import { memo } from 'react';
import {
  EllipsisVertical,
  ChartCandlestick,
  Droplet,
  Bitcoin,
  Undo2,
} from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import WindowButton from '@/pages/app/dashboard/indicators/window-button/index.component.tsx';
import LiquidityButton from '@/pages/app/dashboard/indicators/liquidity-button/index.component.tsx';
import CoinsButton from '@/pages/app/dashboard/indicators/coins-button/index.component';
import { IComponentProps } from '@/pages/app/dashboard/indicators/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Indicators Component
 * Component in charge of displaying the state of the indicators.
 */
const Indicators = memo(({ marketState, openSplitStatesDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);





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
    <Card className='md:mt-2'>
      <CardHeader>
        <CardTitle className='flex justify-start items-center'>
            Indicators
            <span className='flex-1'></span>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label='More information'>
                <EllipsisVertical className='w-5 h-5' aria-hidden='true' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Information</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => displayWindowInfo()}
                >
                  <ChartCandlestick
                    aria-hidden='true'
                    className='mr-1 h-5 w-5'
                  /> Window
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Droplet
                    aria-hidden='true'
                    className='mr-1 h-5 w-5'
                  /> Liquidity
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Bitcoin
                    aria-hidden='true'
                    className='mr-1 h-5 w-5'
                  /> Coins
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Undo2
                    aria-hidden='true'
                    className='mr-1 h-5 w-5 rotate-90'
                  /> Reversal
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
      </CardHeader>
      <CardContent
        className='grid grid-cols-2 gap-1'
      >

        {/* ********
          * WINDOW *
          ******** */}
        <WindowButton
          windowState={marketState.windowState}
          openSplitStatesDialog={openSplitStatesDialog}
        />

        {/* ***********
          * LIQUIDITY *
          *********** */}
        <LiquidityButton
          liquidityState={marketState.liquidityState}
        />

        {/* *******
          * COINS *
          ******* */}
        <CoinsButton
          coinsStates={marketState.coinsStates}
          openSplitStatesDialog={openSplitStatesDialog}
        />

        {/* *******
          * REVERSAL *
          ******* */}
        <button
          className={`h-[45px] text-xs text-white font-bold hover:opacity-80 ${marketState.reversalState === undefined ? 'bg-stateless' : ''}`}
          style={
            marketState.reversalState !== undefined
              ? {
                background: `linear-gradient(90deg, ${ColorService.INCREASE_2} ${marketState.reversalState.points}%, ${ColorService.INCREASE_0} ${marketState.reversalState.points}%)`,
              }
              : {}
          }
        >
          {marketState.reversalState && marketState.reversalState.reversalEventTime ? 'REVERSED' : 'REVERSAL'}
        </button>
      </CardContent>
    </Card>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Indicators;
