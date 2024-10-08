import { useState } from 'react';
import {
  Bitcoin,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { delay } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  ICoinsStates,
  ICoinStateAsset,
  ICompactCoinState,
} from '@/shared/backend/market-state/coins/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { ISplitStatesDialogData } from '@/pages/app/dashboard/split-states-dialog/index.component.tsx';
import CoinsStateDialog from '@/pages/app/dashboard/indicators/coins-button/coins-state-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins Button Component
 * Component in charge of rendering the coins's indicator button as well as handling its actions.
 */
const CoinsButton = ({
  coinsStates,
  openSplitStatesDialog,
}: {
  coinsStates: ICoinsStates<ICompactCoinState>,
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void,
}) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const [assetMenu, setAssetMenu] = useState<boolean>(false);
  const [isDialogOpen, setIsDialogOpen] = useState<ICoinStateAsset>();





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the coins state dialog for an asset.
   * @param asset
   * @returns Promise<void>
   */
  const displayDialog = async (asset: ICoinStateAsset): Promise<void> => {
    setAssetMenu(false);
    await delay(0.5);
    setIsDialogOpen(asset);
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ********
        * BUTTON *
        ******** */}
      <button
        className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_CLASS_NAME[coinsStates.quote.state]}-${ColorService.STATE_CLASS_NAME[coinsStates.base.state]} hover:opacity-80`}
        onClick={() => setAssetMenu(true)}
      >
        COINS
      </button>



      {/* **************
        * ACTIONS MENU *
        ************** */}
      <Sheet open={assetMenu} onOpenChange={setAssetMenu}>
        <SheetContent side='bottom'>
          <div className='mx-auto w-full max-w-sm'>
            <SheetHeader className='space-y-0'>
              <SheetTitle>Select an asset</SheetTitle>
              <SheetDescription>Display the state for all the coins</SheetDescription>
            </SheetHeader>

            <div className='flex flex-row justify-center items-stretch gap-2 sm:gap-4 mt-5'>
              <Button
                variant='outline'
                aria-label={`View the state of the coins in the ${exchangeConfig.quoteAsset} pair`}
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={() => displayDialog('quote')}
              >
                <DollarSign aria-hidden='true' />
                <p>COINS/{exchangeConfig.quoteAsset}</p>
              </Button>
              <Button
                variant='outline'
                aria-label={`View the state of the coins in the ${exchangeConfig.baseAsset} pair`}
                className='flex flex-col h-20 w-full gap-y-1'
                onClick={() => displayDialog('base')}
              >
                <Bitcoin aria-hidden='true' />
                <p>COINS/{exchangeConfig.baseAsset}</p>
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>



      {/* ********
        * DIALOG *
        ******** */}
      {
        isDialogOpen
        && <CoinsStateDialog
          asset={isDialogOpen}
          openSplitStatesDialog={openSplitStatesDialog}
          closeDialog={setIsDialogOpen}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CoinsButton;
