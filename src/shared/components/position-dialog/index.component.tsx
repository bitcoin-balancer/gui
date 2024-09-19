import { useMemo } from 'react';
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
import { useBoundStore } from '@/shared/store/index.store';
import { PositionService, IPosition } from '@/shared/backend/position/index.service.ts';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Dialog Component
 * Component in charge of displaying position details.
 */
const PositionDialog = ({ id }: { id: string }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch<IPosition>(useMemo(
    () => ({
      fetchFunc: { func: PositionService.getPosition, args: [id] },
    }),
    [id],
  ));
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const closePositionDialog = useBoundStore((state) => state.closePositionDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closePositionDialog);





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
        defaultValue='general'
        className='w-full'
      >
        <TabsList
          className='grid w-full grid-cols-3'
        >
          <TabsTrigger value='general'>General</TabsTrigger>
          <TabsTrigger value='increase'>Increase</TabsTrigger>
          <TabsTrigger value='decrease'>Decrease</TabsTrigger>
        </TabsList>


        {/* *********
          * GENERAL *
          ********* */}

        <TabsContent
          value='general'
          className='px-3 animate-in fade-in duration-700'
        >
          <div
            className='flex justify-center items-center mt-5'
          >
            <p
              className='text-light text-sm'
            >Open / Close</p>
            <span className='flex-1'></span>
            <div
              className='text-right max-w-[50%] sm:max-w-[70%]'
            >
              <p
                className='truncate'
              >{formatDate(data.open, 'datetime-medium')}</p>
              {
                data.close !== null
                  ? <p>{formatDate(data.close, 'datetime-medium')}</p>
                  : <p
                    className='text-light text-sm'
                  >N/A</p>
              }
            </div>
          </div>

          <div
            className='flex justify-center items-center mt-5'
          >
            <p
              className='text-light text-sm'
            >Entry / Gain</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(data.entry_price)}</p>
              <p
                className={`${PositionService.getGainClassName(data.roi)} text-sm`}
              >{formatPercentageChange(data.gain, 2)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-center mt-5'
          >
            <p
              className='text-light text-sm'
            >Amount</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatBitcoinAmount(data.amount)}</p>
              <p
                className='text-light text-sm'
              >~{formatDollarAmount(data.amount_quote)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-center mt-5'
          >
            <p
              className='text-light text-sm'
            >{exchangeConfig.quoteAsset} In / Out</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(data.amount_quote_in)}</p>
              <p>{formatDollarAmount(data.amount_quote_out)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-center mt-5'
          >
            <p
              className='text-light text-sm'
            >PNL / ROI</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(data.pnl)}</p>
              <p
                className={`${PositionService.getGainClassName(data.roi)} text-sm`}
              >{formatPercentageChange(data.roi, 2)}</p>
            </div>
          </div>
        </TabsContent>

        {/* **********
          * INCREASE *
          ********** */}
        <TabsContent
          value='increase'
          className='animate-in fade-in duration-700'
        >
          <p>Increase</p>
        </TabsContent>


        {/* **********
          * DECREASE *
          ********** */}
        <TabsContent
          value='decrease'
          className='animate-in fade-in duration-700'
        >
          <p>Decrease</p>
        </TabsContent>
      </Tabs>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Position</DialogTitle>
          <DialogDescription>
            {data?.id}
          </DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionDialog;
