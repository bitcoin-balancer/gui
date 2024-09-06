import { memo, useMemo, useState } from 'react';
import {
  EllipsisVertical,
  ChartCandlestick,
  Droplet,
  Bitcoin,
  Undo2,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
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
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/shadcn/components/ui/drawer.tsx';
import { delay } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import LiquidityStateDialog from './liquidity-state-dialog/index.component.tsx';
import CoinsStateDialog from '@/pages/app/dashboard/indicators/coins-state-dialog/index.component.tsx';
import { IDialogID, IComponentProps } from '@/pages/app/dashboard/indicators/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Retrieves the colors that will be used on the liquidity button.
 * @param bidDominance
 * @returns { asks: string, bids: string }
 */
const getLiquidityColors = (bidDominance: number): { asks: string, bids: string } => {
  if (bidDominance >= 70) {
    return { asks: ColorService.DECREASE_0, bids: ColorService.INCREASE_2 };
  }
  if (bidDominance <= 30) {
    return { asks: ColorService.DECREASE_2, bids: ColorService.INCREASE_0 };
  }
  return { asks: ColorService.DECREASE_1, bids: ColorService.INCREASE_1 };
};





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
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const [activeDialog, setActiveDialog] = useState<IDialogID>();
  const [coinsStateAssetMenu, setCoinsStateAssetMenu] = useState<boolean>(false);
  const [coinsStateDialog, setCoinsStateDialog] = useState<ICoinStateAsset>();
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the colors that will be used by the liquidity button
  const liquidityColors = useMemo(
    () => getLiquidityColors(marketState.liquidityState.bidDominance),
    [marketState.liquidityState.bidDominance],
  );





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Opens the window state dialog an activates the split ID.
   */
  const openWindowStateDialog = (): void => (
    openSplitStatesDialog({
      moduleID: 'WINDOW',
      moduleState: {
        state: marketState.windowState.state,
        splitStates: marketState.windowState.splitStates,
        window: toSplitStateItems(marketState.windowState.window),
      },
    })
  );

  /**
   * Displays the coins state dialog for an asset.
   * @param asset
   * @returns Promise<void>
   */
  const displayCoinsStateDialog = async (asset: ICoinStateAsset): Promise<void> => {
    setCoinsStateAssetMenu(false);
    await delay(0.25);
    setActiveDialog('coins');
    setCoinsStateDialog(asset);
  };

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
          <button
            className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_BG_CLASS_NAME[marketState.windowState.state]} hover:opacity-80`}
            onClick={openWindowStateDialog}
          >
            WINDOW
          </button>

          {/* ***********
            * LIQUIDITY *
            *********** */}
          <button
            className='h-[45px] text-xs text-white font-bold hover:opacity-80'
            onClick={() => setActiveDialog('liquidity')}
            style={{
              background: `linear-gradient(90deg, ${liquidityColors.bids} ${marketState.liquidityState.bidDominance}%, ${liquidityColors.asks} ${marketState.liquidityState.bidDominance}%)`,
            }}
          >
            LIQUIDITY
          </button>

          {/* *******
            * COINS *
            ******* */}
          <button
            className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_CLASS_NAME[marketState.coinsStates.quote.state]}-${ColorService.STATE_CLASS_NAME[marketState.coinsStates.base.state]} hover:opacity-80`}
            onClick={() => setCoinsStateAssetMenu(true)}
          >
            COINS
          </button>

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



      {/* **************************
        * COINS STATE ASSET DRAWER *
        ************************** */}
      <Drawer open={coinsStateAssetMenu} onOpenChange={setCoinsStateAssetMenu}>
        <DrawerContent>
          <div
            className='mx-auto w-full max-w-sm'
          >
            <DrawerHeader>
              <DrawerTitle>Select an asset</DrawerTitle>
              <DrawerDescription
                className='flex justify-center items-center sm:justify-start'
              >
                Display the state for the coins
              </DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              className='flex flex-row justify-center items-stretch'
            >
              <Button
                variant='outline'
                aria-label={`View the state of the coins in the ${exchangeConfig.quoteAsset} pair`}
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={() => displayCoinsStateDialog('quote')}
              >
                <DollarSign aria-hidden='true' />
                <p>COINS/{exchangeConfig.quoteAsset}</p>
              </Button>
              <Button
                variant='outline'
                aria-label={`View the state of the coins in the ${exchangeConfig.baseAsset} pair`}
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={() => displayCoinsStateDialog('base')}
              >
                <Bitcoin aria-hidden='true' />
                <p>COINS/{exchangeConfig.baseAsset}</p>
              </Button>
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>





      {/* ********************
        * COINS STATE DIALOG *
        ******************** */}
      {
        activeDialog === 'liquidity'
        && <LiquidityStateDialog
          closeDialog={setActiveDialog}
        />
      }
      {
        (activeDialog === 'coins' && coinsStateDialog !== undefined)
        && <CoinsStateDialog
          asset={coinsStateDialog}
          openSplitStatesDialog={openSplitStatesDialog}
          closeDialog={setActiveDialog}
        />
      }
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Indicators;
