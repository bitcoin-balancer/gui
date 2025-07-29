import { memo, useMemo, useState } from 'react';
import { EllipsisVertical, DollarSign, Bitcoin, Loader2 } from 'lucide-react';
import { delay } from 'web-utils-kit';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  CoinsService,
  ICoinStateAsset,
} from '@/shared/backend/market-state/coins/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IComponentProps } from '@/pages/app/dashboard/coins/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins Component
 * Component in charge of displaying the state of the coins for the quote and base assets.
 */
const Coins = memo(({ coinsStates, openSplitStatesDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [activeSymbol, setActiveSymbol] = useState<string>('');
  const [isRetrievingState, setIsRetrievingState] = useState<boolean>(false);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const openLargeInfoDialog = useBoundStore((state) => state.openLargeInfoDialog);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Activates a symbol and opens the drawer.
   * @param symbol
   */
  const activateSymbol = (symbol: string): void => {
    setActiveSymbol(symbol);
    setIsOpen(true);
  };

  /**
   * Displays the split states dialog for a symbol and asset.
   * @param asset
   * @returns Promise<void>
   */
  const displaySplitStateDialog = async (asset: ICoinStateAsset): Promise<void> => {
    setIsRetrievingState(true);
    try {
      const state = await CoinsService.getStateForSymbol(asset, activeSymbol);
      setIsOpen(false);
      await delay(0.5);
      openSplitStatesDialog({
        moduleID: 'COINS',
        asset,
        symbol: activeSymbol,
        moduleState: state,
      });
    } catch (e) {
      errorToast(e);
    } finally {
      setIsRetrievingState(false);
    }
  };

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the list of symbols being used
  const topSymbols = useMemo(
    () => Object.keys(coinsStates.quote.statesBySymbol).sort(),
    [coinsStates.quote.statesBySymbol],
  );

  // the background class that will be applied to the coins module's button
  const coinBackgrounds: { [symbol: string]: string } = useMemo(
    () =>
      topSymbols.reduce(
        (previous, current) => ({
          ...previous,
          [current]:
            exchangeConfig.baseAsset === current
              ? `${ColorService.STATE_CLASS_NAME[coinsStates.quote.statesBySymbol[current].state]}-stateless`
              : `${ColorService.STATE_CLASS_NAME[coinsStates.quote.statesBySymbol[current].state]}-${ColorService.STATE_CLASS_NAME[coinsStates.base.statesBySymbol[current].state]}`,
        }),
        {},
      ),
    [
      topSymbols,
      exchangeConfig.baseAsset,
      coinsStates.quote.statesBySymbol,
      coinsStates.base.statesBySymbol,
    ],
  );

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <Card className="md:mt-2">
        <CardHeader>
          <CardTitle className="flex justify-start items-center">
            Coins
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
                <DropdownMenuItem onClick={() => openLargeInfoDialog('coins')}>
                  <Bitcoin
                    aria-hidden="true"
                    className="mr-1 h-5 w-5"
                  />{' '}
                  Coins
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-4 gap-1">
          {topSymbols.map((symbol) => (
            <button
              key={symbol}
              className={`h-[45px] text-xs text-white font-bold ${coinBackgrounds[symbol]} hover:opacity-80`}
              onClick={() => activateSymbol(symbol)}
            >
              {symbol}
            </button>
          ))}
        </CardContent>
      </Card>

      {/* **************
       * ACTIONS MENU *
       ************** */}
      <Sheet
        open={isOpen}
        onOpenChange={setIsOpen}
      >
        <SheetContent side="bottom">
          <div className="mx-auto w-full max-w-sm">
            <SheetHeader className="space-y-0">
              <SheetTitle>Select a pair</SheetTitle>
              <SheetDescription className="flex justify-center items-center sm:justify-start">
                {isRetrievingState && <Loader2 className="mr-1 h-4 w-4 animate-spin" />}
                {isRetrievingState
                  ? 'Retrieving state...'
                  : `Display the state for ${activeSymbol}`}
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-row justify-center items-stretch gap-2 sm:gap-4 mt-5">
              <Button
                variant="outline"
                aria-label={`View the state of the coin in the ${exchangeConfig.quoteAsset} pair`}
                className="flex flex-col h-20 w-full gap-y-1"
                onClick={() => displaySplitStateDialog('quote')}
                disabled={isRetrievingState}
              >
                <DollarSign aria-hidden="true" />
                <p>
                  {activeSymbol}/{exchangeConfig.quoteAsset}
                </p>
              </Button>
              <Button
                variant="outline"
                aria-label={`View the state of the coin in the ${exchangeConfig.baseAsset} pair`}
                className="flex flex-col h-20 w-full gap-y-1"
                onClick={() => displaySplitStateDialog('base')}
                disabled={isRetrievingState || activeSymbol === exchangeConfig.baseAsset}
              >
                <Bitcoin aria-hidden="true" />
                <p>
                  {activeSymbol}/{exchangeConfig.baseAsset}
                </p>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Coins;
