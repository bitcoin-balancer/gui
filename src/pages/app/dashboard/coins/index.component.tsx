import { useMemo } from 'react';
import { EllipsisVertical } from 'lucide-react';
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IComponentProps } from '@/pages/app/dashboard/coins/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins Component
 * Component in charge of displaying the state of the coins for the quote and base assets.
 */
const Coins = ({ coinsStates }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  /* console.log('In Coins'); */




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the list of symbols being used
  const topSymbols = useMemo(
    () => Object.keys(coinsStates.quote.statesBySymbol).sort(),
    [coinsStates.quote.statesBySymbol],
  );

  // the background class that will be applied to the coins module's button
  const coinBackgrounds: { [symbol: string ]: string } = useMemo(
    () => topSymbols.reduce(
      (previous, current) => ({
        ...previous,
        [current]: exchangeConfig.baseAsset === current
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
      <Card className='md:mt-7'>
        <CardHeader>
          <CardTitle className='flex justify-start items-center'>
              Coins
              <span className='flex-1'></span>
              <DropdownMenu>
                <DropdownMenuTrigger aria-label='More information'>
                  <EllipsisVertical className='w-5 h-5' aria-hidden='true' />
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                  <DropdownMenuItem>Billing</DropdownMenuItem>
                  <DropdownMenuItem>Team</DropdownMenuItem>
                  <DropdownMenuItem>Subscription</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </CardTitle>
        </CardHeader>
        <CardContent
          className='grid grid-cols-4 gap-1'
        >

          {topSymbols.map((symbol) => (
            <button
              key={symbol}
              className={`h-[45px] text-xs text-white font-bold ${coinBackgrounds[symbol]} hover:opacity-80`}
            >
              {symbol}
            </button>
          ))}
        </CardContent>
      </Card>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Coins;
