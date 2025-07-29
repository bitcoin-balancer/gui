import { memo } from 'react';
import { EllipsisVertical, ChartCandlestick, Droplet, Bitcoin, Undo2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import WindowButton from '@/pages/app/dashboard/indicators/window-button/index.component.tsx';
import LiquidityButton from '@/pages/app/dashboard/indicators/liquidity-button/index.component.tsx';
import CoinsButton from '@/pages/app/dashboard/indicators/coins-button/index.component';
import ReversalButton from '@/pages/app/dashboard/indicators/reversal-button/index.component.tsx';
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
  const openLargeInfoDialog = useBoundStore((state) => state.openLargeInfoDialog);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card className="md:mt-2">
      <CardHeader>
        <CardTitle className="flex justify-start items-center">
          Indicators
          <span className="flex-1"></span>
          <DropdownMenu>
            <DropdownMenuTrigger aria-label="More information">
              <EllipsisVertical
                className="w-5 h-5"
                aria-hidden="true"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>Information</DropdownMenuLabel>
              <DropdownMenuItem onClick={() => openLargeInfoDialog('window')}>
                <ChartCandlestick
                  aria-hidden="true"
                  className="mr-1 h-5 w-5"
                />{' '}
                Window
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openLargeInfoDialog('liquidity')}>
                <Droplet
                  aria-hidden="true"
                  className="mr-1 h-5 w-5"
                />{' '}
                Liquidity
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openLargeInfoDialog('coins')}>
                <Bitcoin
                  aria-hidden="true"
                  className="mr-1 h-5 w-5"
                />{' '}
                Coins
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => openLargeInfoDialog('reversal')}>
                <Undo2
                  aria-hidden="true"
                  className="mr-1 h-5 w-5 rotate-90"
                />{' '}
                Reversal
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-1">
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
        <LiquidityButton liquidityState={marketState.liquidityState} />

        {/* *******
         * COINS *
         ******* */}
        <CoinsButton
          coinsStates={marketState.coinsStates}
          openSplitStatesDialog={openSplitStatesDialog}
        />

        {/* **********
         * REVERSAL *
         ********** */}
        <ReversalButton reversalState={marketState.reversalState} />
      </CardContent>
    </Card>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Indicators;
