import {
  memo,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ICoinStateAsset } from '@/shared/backend/market-state/coins/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import {
  ICoinsStateDialogData,
  IComponentProps,
} from '@/pages/app/dashboard/indicators/coins-state-dialog/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins State Dialog Component
 * Component in charge of displaying a line chart for each coin for an asset.
 */
const CoinsStateDialog = memo(({
  data: {
    asset,
    moduleState,
  },
  closeDialog,
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isOpen, setIsOpen] = useState<boolean>(true);
  const breakpoint = useMediaQueryBreakpoint();
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the name of the asset
  const assetName = asset === 'quote' ? exchangeConfig.quoteAsset : exchangeConfig.baseAsset;





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Handles the closing of the dialog after a small delay.
   */
  const handleCloseDialog = (): void => {
    setIsOpen(false);
    setTimeout(() => {
      closeDialog();
    }, 250);
  };





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[1200px]'
      >

        {/* ***************
          * DIALOG HEADER *
          *************** */}
        <DialogHeader>
          <DialogTitle>
            COINS/{assetName}
            <StateIcon
              className='ml-2'
              state={moduleState.state}
            />
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>



        <p>This is the coins state dialog! :)</p>

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CoinsStateDialog;
export type {
  ICoinsStateDialogData,
};
