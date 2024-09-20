import {
  memo,
  useState,
  useEffect,
  Fragment,
} from 'react';
import { Archive } from 'lucide-react';
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
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/shared/shadcn/components/ui/accordion.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import { PositionService, IPosition } from '@/shared/backend/position/index.service.ts';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PositionAction from '@/shared/components/position-dialog/position-action.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Dialog Component
 * Component in charge of displaying position details.
 */
const PositionDialog = memo(({ data }: { data: string | IPosition }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [position, setPosition] = useState<IPosition>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | undefined>(undefined);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const closePositionDialog = useBoundStore((state) => state.closePositionDialog);
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closePositionDialog);



  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Retrieves and sets the requested position. If the record was passed, it sets it right away.
   */
  useEffect(
    () => {
      let ignore = false;

      const fetchPosition = async () => {
        try {
          const value = typeof data === 'string' ? await PositionService.getPosition(data) : data;
          if (!ignore) {
            setPosition(value);
            setLoading(false);
            setError(undefined);
          }
        } catch (e) {
          setError(e as Error);
        }
      };

      fetchPosition();

      return () => { ignore = true; };
    },
    [data],
  );





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
          className='px-3 pt-3 animate-in fade-in duration-700'
        >
          <div
            className='flex justify-center items-start'
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
              >{formatDate(position!.open, 'datetime-medium')}</p>
              {
                position!.close !== null
                  ? <p>{formatDate(position!.close, 'datetime-medium')}</p>
                  : <p
                    className='text-light text-sm'
                  >N/A</p>
              }
            </div>
          </div>

          <div
            className='flex justify-center items-start mt-5'
          >
            <p
              className='text-light text-sm'
            >Entry / Gain</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(position!.entry_price)}</p>
              <p
                className={`${PositionService.getGainClassName(position!.gain)} text-sm`}
              >{formatPercentageChange(position!.gain, 2)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-start mt-5'
          >
            <p
              className='text-light text-sm'
            >Amount</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatBitcoinAmount(position!.amount)}</p>
              <p
                className='text-light text-sm'
              >~{formatDollarAmount(position!.amount_quote)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-start mt-5'
          >
            <p
              className='text-light text-sm'
            >{exchangeConfig.quoteAsset} In / Out</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(position!.amount_quote_in)}</p>
              <p>{formatDollarAmount(position!.amount_quote_out)}</p>
            </div>
          </div>

          <div
            className='flex justify-center items-start mt-5'
          >
            <p
              className='text-light text-sm'
            >PNL / ROI</p>
            <span className='flex-1'></span>
            <div
              className='text-right'
            >
              <p>{formatDollarAmount(position!.pnl)}</p>
              <p
                className={`${PositionService.getGainClassName(position!.roi)} text-sm`}
              >{formatPercentageChange(position!.roi, 2)}</p>
            </div>
          </div>
        </TabsContent>



        {/* **********
          * INCREASE *
          ********** */}
        <TabsContent
          value='increase'
          className='px-3 pt-2 animate-in fade-in duration-700'
        >
          {
            position!.increase_actions.map((action, i) => (
              <Fragment key={i}>
                <PositionAction action={action} />
                {
                  i < position!.increase_actions.length - 1
                  && <Separator className='my-10' />
                }
              </Fragment>
            ))
          }
        </TabsContent>



        {/* **********
          * DECREASE *
          ********** */}
        <TabsContent
          value='decrease'
          className='px-3 pt-2 animate-in fade-in duration-700'
        >
          <Accordion
            type='single'
            collapsible
            className='w-full'
          >
            {position!.decrease_actions.map((decreaseLevel, levelNum) => (
              <AccordionItem key={levelNum} value={`level-${levelNum}`}>
                <AccordionTrigger>Level {levelNum}</AccordionTrigger>
                <AccordionContent>
                  {
                    decreaseLevel.length
                      ? (
                        decreaseLevel.map((action, i) => (
                          <Fragment key={i}>
                            <PositionAction action={action} />
                            {
                              i < decreaseLevel.length - 1
                              && <Separator className='my-10' />
                            }
                          </Fragment>
                        ))
                      )
                      : <NoRecords />
                  }
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
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
          <div
            className='flex justify-start items-center'
          >
            <DialogTitle>Position</DialogTitle>
            {
              position! && position!.archived
              && <Archive
              aria-label='hidden'
              className='ml-2 h-4 w-4'
            />
            }
          </div>
          <DialogDescription>
            {position?.id}
          </DialogDescription>
        </DialogHeader>

        {content}

      </DialogContent>

    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionDialog;
