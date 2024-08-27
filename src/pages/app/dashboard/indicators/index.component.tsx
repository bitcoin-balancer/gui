/* import { useMemo } from 'react'; */
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
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IComponentProps } from '@/pages/app/dashboard/indicators/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Indicators Component
 * Component in charge of displaying the state of the indicators.
 */
// eslint-disable-next-line arrow-body-style
const Indicators = ({ marketState }: IComponentProps) => {
  /* console.log('In Indicators'); */



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <Card className='md:mt-7'>
        <CardHeader>
          <CardTitle className='flex justify-start items-center'>
              Indicators
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
          className='grid grid-cols-2 gap-1'
        >

          {/* ********
            * WINDOW *
            ******** */}
          <button
            className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_TW_CLASS_NAME[marketState.windowState.state]} hover:opacity-80`}
          >
            WINDOW
          </button>

          {/* ***********
            * LIQUIDITY *
            *********** */}
          <button
            className='h-[45px] text-xs text-white font-bold bg-stateless hover:opacity-80'
          >
            LIQUIDITY
          </button>

          {/* *******
            * COINS *
            ******* */}
          <button
            className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_CLASS_NAME[marketState.coinsStates.quote.state]}-${ColorService.STATE_CLASS_NAME[marketState.coinsStates.base.state]} hover:opacity-80`}
          >
            COINS
          </button>

          {/* *******
            * REVERSAL *
            ******* */}
          <button
            className='h-[45px] text-xs text-white font-bold bg-stateless hover:opacity-80'
          >
            REVERSAL
          </button>
        </CardContent>
      </Card>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Indicators;
