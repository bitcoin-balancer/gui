import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { SWService } from 'sw-service';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/ui/select.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
  FormDescription,
} from '@/shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { numberValid } from '@/shared/backend/validations/index.service.ts';
import { WindowService, IWindowConfig } from '@/shared/backend/market-state/window/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import FormLabelWithMoreInfo from '@/shared/components/form-label-with-more-info/index.component.tsx';
import { IFormProps } from '@/pages/app/adjustments/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Component
 * Component in charge of updating the window's configuration.
 */
const Window = ({ open, onOpenChange }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch<IWindowConfig>(useMemo(
    () => ({
      fetchFunc: { func: WindowService.getConfig },
    }),
    [],
  ));
  const form = useForm<IWindowConfig>({
    defaultValues: {
      refetchFrequency: data?.refetchFrequency ?? '',
      size: data?.size ?? '',
      interval: data?.interval ?? '',
      requirement: data?.requirement ?? '',
      strongRequirement: data?.strongRequirement ?? '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  useEffect(() => {
    if (data) {
      form.setValue('refetchFrequency', data.refetchFrequency);
      form.setValue('size', data.size);
      form.setValue('interval', data.interval);
      form.setValue('requirement', data.requirement);
      form.setValue('strongRequirement', data.strongRequirement);
    }
  }, [data, form]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Triggers whenever the form is submitted and it prompts the user with the confirmation dialog.
   * @param formData
   * @returns void
   */
  const onSubmit = (formData: IWindowConfig): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update window\'s configuration',
      description: 'The new configuration will be applied immediately upon submission. Moreover, the app will be refreshed automatically in order to prevent discrepancies',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await WindowService.updateConfig(
            {
              refetchFrequency: Number(formData.refetchFrequency),
              size: Number(formData.size),
              interval: formData.interval,
              requirement: Number(formData.requirement),
              strongRequirement: Number(formData.strongRequirement),
            },
            confirmation,
          );
          onOpenChange(false);
          setTimeout(() => {
            SWService.updateApp();
          }, 2000);
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 21501) {
            form.setError('refetchFrequency', { message });
          }
          if (code === 21505) {
            form.setError('size', { message });
          }
          if (code === 21506) {
            form.setError('interval', { message });
          }
          if (code === 21502 || code === 21504) {
            form.setError('requirement', { message });
          }
          if (code === 21503) {
            form.setError('strongRequirement', { message });
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
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >

          <fieldset>
            <h3 className='text-md font-semibold'>Window</h3>

            <FormField
              control={form.control}
              name='refetchFrequency'
              render={({ field }) => (
                <FormItem className='mt-5'>
                  <FormLabelWithMoreInfo
                    value='Re-fetch frequency (seconds)'
                    description={[
                      'The interval at which the pricing data is re-fetched from the exchange.',
                      '-----',
                      'When using Kraken, ensure your request frequency respects their strict rate limits.  Setting a value larger than 10 seconds for your request interval is recommended to avoid hitting rate limits and ensure smooth operation.',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='2.5'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={2.5}
                      max={60}
                      />
                  </FormControl>
                  <FormDescription>Refresh interval</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 2.5, 60) ? true : 'Enter a number ranging 2.5 - 60'),
                },
              }}
            />

            <FormField
              control={form.control}
              name='size'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Window size'
                    description='The number of candlestick bars that comprise the window.'
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='128'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={128}
                      max={512}
                      />
                  </FormControl>
                  <FormDescription>Candlestick bars</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 128, 512) ? true : 'Enter a number ranging 128 - 512'),
                },
              }}
            />

            <FormField
              control={form.control}
              name='interval'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Interval'
                    description='The amount of time contained by each candlestick bar.'
                    htmlFor='intervalSelect'
                  />
                  <FormControl>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      value={field.value}
                      disabled={isSubmitting}
                      name='intervalSelect'
                    >
                      <SelectTrigger id='intervalSelect'>
                        <SelectValue placeholder='Select one option' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='1m'>1 minute</SelectItem>
                        <SelectItem value='5m'>5 minutes</SelectItem>
                        <SelectItem value='15m'>15 minutes</SelectItem>
                        <SelectItem value='30m'>30 minutes</SelectItem>
                        <SelectItem value='1h'>1 hour</SelectItem>
                        <SelectItem value='1d'>1 day</SelectItem>
                        <SelectItem value='1w'>1 week</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormDescription>Candlestick bar duration</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (value.length ? true : 'Select a valid interval'),
                },
              }}
            />
          </fieldset>

          <Separator className='my-10' />


          <fieldset>
            <h3 className='text-md font-semibold'>State</h3>

            <FormField
              control={form.control}
              name='requirement'
              render={({ field }) => (
                <FormItem className='mt-5'>
                  <FormLabelWithMoreInfo
                    value='State requirement%'
                    description={[
                      'The percentage change in Bitcoin\'s price needed to mark a window split as "stateful". ',
                      'The possible states for this requirement are:',
                      ' 1: increasing',
                      '-1: decreasing',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.025'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={0.01}
                      max={100}
                      />
                  </FormControl>
                  <FormDescription>Bitcoin's price% change</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 0.01, 100) ? true : 'Enter a number ranging 0.01% - 100%'),
                },
              }}
            />

            <FormField
              control={form.control}
              name='strongRequirement'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Strong state requirement%'
                    description={[
                      'The percentage change in Bitcoin\'s price needed to mark a window split as "stateful". ',
                      'The possible states for this requirement are:',
                      ' 2: increasing strongly',
                      '-2: decreasing strongly',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.85'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={0.01}
                      max={100}
                      />
                  </FormControl>
                  <FormDescription>Bitcoin's price% change</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 0.01, 100) ? true : 'Enter a number ranging 0.01% - 100%'),
                },
              }}
            />
          </fieldset>


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
                />
              } Update configuration
            </Button>
          </DialogFooter>

        </form>

      </Form>
    );
  }
  return (
    <Dialog
      open={open}
      onOpenChange={onOpenChange}
    >

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Update Window</DialogTitle>
          <DialogDescription className='flex justify-center items-center sm:justify-start'>
            Connected to
            <img
              src={`/exchanges/${exchangeConfig.window}.png`}
              alt={`Logo of the Exchange being used by the Window Module (${exchangeConfig.window})`}
              height={435}
              width={90}
              className='ml-1 max-h-4'
            />
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
export default Window;
