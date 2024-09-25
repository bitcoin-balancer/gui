import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import { Textarea } from '@/shared/shadcn/components/ui/textarea.tsx';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Popover, PopoverContent, PopoverTrigger } from '@/shared/shadcn/components/ui/popover.tsx';
import { Calendar } from '@/shared/shadcn/components/ui/calendar.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/ui/select.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { formatBitcoinAmount, formatDate } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { stringValid, numberValid } from '@/shared/backend/validations/index.service.ts';
import { IManualTrade } from '@/shared/backend/position/trade/index.service.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import {
  IRecordFormProps,
  IRecordFormInputs,
  IAction,
} from '@/pages/app/positions/position/trades/types.ts';
import FormLabelWithMoreInfo from '@/shared/components/form-label-with-more-info/index.component';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Turns the form data into a manual trade that can be sent to the backend.
 * @param data
 * @returns IManualTrade
 */
const toManualTrade = (data: IRecordFormInputs): IManualTrade => ({
  event_time: data.event_time.getTime(),
  side: data.side,
  notes: data.notes,
  price: Number(data.price),
  amount: Number(data.amount),
});





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Record Form Component
 * Component in charge of creating and updating records.
 */
const RecordForm = ({ record, closeDialog }: IRecordFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(() => undefined);
  const serverTime = useBoundStore((state) => state.serverTime!);
  const form = useForm<IRecordFormInputs>({
    defaultValues: {
      event_time: record?.event_time ? new Date(record.event_time) : new Date(serverTime),
      side: record?.side ? record.side : 'BUY',
      notes: record?.notes ? record.notes : '',
      price: record?.price ? String(record.price) : '',
      amount: record?.amount ? String(record.amount) : '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Handles the closing of the dialog. An action can be provided to manage the state in the parent
   * component.
   * @param action
   * @returns Promise<void>
   */
  const __handleCloseDialog = async (action: IAction | undefined): Promise<void> => {
    await handleCloseDialog();
    closeDialog(action);
  };

  /**
   * Triggers whenever the form is submitted and it prompts the user with the confirmation dialog.
   * @param data
   * @returns void
   */
  const onSubmit = (data: IRecordFormInputs): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: record === null ? 'Create trade' : 'Update trade',
      description: record === null
        ? `A ${data.side} trade for ${formatBitcoinAmount(Number(data.amount))} will be created, altering the position immediately upon submission`
        : `The ${data.side} trade '${record!.id}' for ${formatBitcoinAmount(Number(data.amount))} will be updated, altering the position immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);

          // handle the action accordingly
          if (record) {
            const payload = await PositionService.updateTrade(
              record.id!,
              toManualTrade(data),
              confirmation,
            );
            __handleCloseDialog({ type: 'UPDATE_TRADE', payload });
          } else {
            const payload = await PositionService.createTrade(toManualTrade(data), confirmation);
            __handleCloseDialog({ type: 'CREATE_TRADE', payload });
          }
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 33501 || code === 33502 || code === 30517) {
            form.setError('event_time', { message });
          }
          if (code === 33503 || code === 30519) {
            form.setError('side', { message });
          }
          if (code === 33504) {
            form.setError('notes', { message });
          }
          if (code === 33505 || code === 30516) {
            form.setError('price', { message });
          }
          if (code === 33506 || code === 30515) {
            form.setError('amount', { message });
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => __handleCloseDialog(undefined)}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>{record === null ? 'Create trade' : 'Update trade'}</DialogTitle>
          <DialogDescription>
            The trade will be {record === null ? 'created' : 'updated'} and the position will be recalculated immediately upon submission
          </DialogDescription>
        </DialogHeader>

        {
          record
          && <>
            <div
              className='flex justify-start items-center'
            >
              <p
                className='text-light text-xs sm:text-sm'
              >ID</p>
              <span className='flex-1'></span>
              <p>{record.id}</p>
            </div>
          </>
        }

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <FormField
                control={form.control}
                name='event_time'
                render={({ field }) => (
                  <FormItem className='flex flex-col'>
                    <FormLabel>Event time</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant='outline'
                            className={`w-full pl-3 text-left font-normal ${!field.value ? 'text-light' : ''}`}
                            autoFocus
                          >
                            {field.value ? (
                              formatDate(field.value, 'datetime-medium')
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon
                              aria-hidden='true'
                              className='ml-auto h-4 w-4 opacity-50'
                            />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent
                        className='w-auto p-0'
                        align='start'
                      >
                        <Calendar
                          mode='single'
                          selected={field.value}
                          onSelect={field.onChange}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      Trade execution date
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='side'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Side'
                      description={[
                        'The kind of action that was executed.',
                        'In a \'buy\' trade, you exchange Dollars for Bitcoin. On the other hand, in a \'sell\' trade, you send Bitcoin in exchange for Dollars.',
                      ]}
                      htmlFor='sideSelect'
                    />
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                        disabled={isSubmitting}
                        name='sideSelect'
                      >
                        <SelectTrigger id='sideSelect'>
                          <SelectValue placeholder='Select one option' />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value='BUY'>Buy</SelectItem>
                          <SelectItem value='SELL'>Sell</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormDescription>Kind of action</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (value.length ? true : 'Select a valid side'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='price'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Price'
                      description={[
                        'The price in $ at which the trade was executed.',
                        'Set this value carefully as it influences the entry price of the position in case of purchases.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='66185.13'
                        {...field}
                        autoComplete='off'
                        min={0.01}
                        max={Number.MAX_SAFE_INTEGER}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>The rate of the exchange (Bitcoin/USD)</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 0.01, Number.MAX_SAFE_INTEGER) ? true : 'Enter a valid price'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='amount'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Amount'
                      description={[
                        'The amount of Bitcoin that was bought or sold.',
                        'Set this value carefully as it influences the position\'s amount.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='0.0712'
                        {...field}
                        autoComplete='off'
                        min={0.00000001}
                        max={Number.MAX_SAFE_INTEGER}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>The amount of Bitcoin traded</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 0.00000001, Number.MAX_SAFE_INTEGER) ? true : 'Enter a valid amount'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Notes'
                      description='The notes should contain the reason why the trade is being created and the expected effect it will have on the position.'
                    />
                    <FormControl>
                      <Textarea
                        placeholder='Explain why the trade is being created'
                        rows={7}
                        autoComplete='false'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormDescription>Description of the trade</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (value.length > 0 && !stringValid(value, 10, 49999) ? 'Enter a valid description' : true),
                  },
                }}
              />

              <DialogFooter>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='mt-7 w-full'
                >
                  {
                    isSubmitting
                    && <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                    />} {record === null ? 'Create trade' : 'Update trade'}
                </Button>
              </DialogFooter>

            </form>
          </Form>

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default RecordForm;
