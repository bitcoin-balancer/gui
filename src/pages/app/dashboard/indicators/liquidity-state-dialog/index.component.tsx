import { memo, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
} from '@/shared/services/transformers/index.service.ts';
import { IInfoDialogConfig } from '@/shared/store/slices/info-dialog/types.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  LiquidityService,
  ILiquidityState,
} from '@/shared/backend/market-state/liquidity/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import LiquiditySummary from '@/pages/app/dashboard/indicators/liquidity-state-dialog/summary.component.tsx';
import PriceLevels from '@/pages/app/dashboard/indicators/liquidity-state-dialog/price-levels.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/indicators/liquidity-state-dialog/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// ...




/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the content that will be inserted in the info dialog.
 * @param state
 * @returns IInfoDialogConfig
 */
const buildInfoDialogContent = (state: ILiquidityState): IInfoDialogConfig => ({
  title: 'Liquidity Snapshot',
  content: [
    'LAST REFETCH',
    formatDate(state.lastRefetch, 'datetime-medium'),
    '-----',
    'PRICE RANGE',
    `Upper: ${formatDollarAmount(state.priceRange.upper)}`,
    `Current: ${formatDollarAmount(state.priceRange.current)}`,
    `Lower: ${formatDollarAmount(state.priceRange.lower)}`,
    '-----',
    'INTENSITY REQUIREMENTS',
    `Low: ${formatBitcoinAmount(state.intensityRequirements.low)}`,
    `Medium: ${formatBitcoinAmount(state.intensityRequirements.medium)}`,
    `High: ${formatBitcoinAmount(state.intensityRequirements.high)}`,
    `Very high: ${formatBitcoinAmount(state.intensityRequirements.veryHigh)}`,
  ],
});





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity State Dialog Component
 * Component in charge of displaying the current state of the liquidity.
 */
const LiquidityStateDialog = memo(({ closeDialog }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<ILiquidityState>(useMemo(
    () => ({
      fetchFunc: { func: LiquidityService.getState },
    }),
    [],
  ));
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...



  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the informational dialog for the current snapshot.
   */
  const displayLiquidityInfo = (): void => openInfoDialog(buildInfoDialogContent(data));





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
      <Tabs
        defaultValue='summary'
        className='w-full'
      >
        <TabsList
          className='grid w-full grid-cols-3'
        >
          <TabsTrigger value='summary'>Summary</TabsTrigger>
          <TabsTrigger value='bids'>Bids</TabsTrigger>
          <TabsTrigger value='asks'>Asks</TabsTrigger>
        </TabsList>


        {/* *********
          * SUMMARY *
          ********* */}

        <TabsContent
          value='summary'
          className='p-3 animate-in fade-in duration-700'
        >
          <LiquiditySummary state={data} />
        </TabsContent>

        {/* ******
          * BIDS *
          ****** */}
        <TabsContent
          value='bids'
          className='animate-in fade-in duration-700'
        >
          <PriceLevels
            id='bids'
            side={data.bids}
          />
        </TabsContent>


        {/* ******
          * ASKS *
          ****** */}
        <TabsContent
          value='asks'
          className='animate-in fade-in duration-700'
        >
          <PriceLevels
            id='asks'
            side={data.asks}
          />
        </TabsContent>
      </Tabs>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent
        className='max-w-[900px]'
      >

        <DialogHeader>
          <DialogTitle>
            <button
              aria-label='Display liquidity information'
              onClick={displayLiquidityInfo}
            >
              Liquidity
            </button>
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LiquidityStateDialog;
