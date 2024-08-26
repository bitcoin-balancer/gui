import { useMemo } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
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
          <CardTitle>Indicators</CardTitle>
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
