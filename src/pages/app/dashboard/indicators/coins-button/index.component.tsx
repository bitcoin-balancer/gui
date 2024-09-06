import { useState } from 'react';
import {
  Bitcoin,
  DollarSign,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
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
    await delay(0.25);
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



      {/* ********
        * DRAWER *
        ******** */}
      <Drawer open={assetMenu} onOpenChange={setAssetMenu}>
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
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>


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
