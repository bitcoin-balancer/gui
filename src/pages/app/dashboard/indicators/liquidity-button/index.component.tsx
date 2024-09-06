import { useMemo, useState } from 'react';
import { ICompactLiquidityState } from '@/shared/backend/market-state/liquidity/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import LiquidityStateDialog from '@/pages/app/dashboard/indicators/liquidity-button/liquidity-state-dialog/index.component.tsx';

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
 * Liquidity Button
 * Component in charge of rendering the liquidity's indicator button as well as handling its
 * actions.
 */
const LiquidityButton = ({ liquidityState }: { liquidityState: ICompactLiquidityState }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the colors that will be used by the liquidity button
  const liquidityColors = useMemo(
    () => getLiquidityColors(liquidityState.bidDominance),
    [liquidityState.bidDominance],
  );



  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ******************
        * INDICATOR BUTTON *
        ****************** */}
      <button
        className='h-[45px] text-xs text-white font-bold hover:opacity-80'
        onClick={() => setIsDialogOpen(true)}
        style={{
          background: `linear-gradient(90deg, ${liquidityColors.bids} ${liquidityState.bidDominance}%, ${liquidityColors.asks} ${liquidityState.bidDominance}%)`,
        }}
      >
        LIQUIDITY
      </button>


      {/* ********
        * DIALOG *
        ******** */}
      {
        isDialogOpen
        && <LiquidityStateDialog
          closeDialog={setIsDialogOpen}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LiquidityButton;
