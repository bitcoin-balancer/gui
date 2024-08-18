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
  FormLabel,
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
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { numberValid } from '@/shared/backend/validations/index.service.ts';
import { WindowService, IWindowConfig } from '@/shared/backend/market-state/window/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IFormProps } from './types.ts';

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

          <FormField
            control={form.control}
            name='refetchFrequency'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Re-fetch frequency (seconds)</FormLabel>
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
                <FormDescription>
                  The interval at which the pricing data is re-fetched from the exchange
                </FormDescription>
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
              <FormItem className='mt-5'>
                <FormLabel>Window size</FormLabel>
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
                <FormDescription>
                  The number of candlestick bars that comprise the window
                </FormDescription>
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
              <FormItem className='mt-5'>
                <FormLabel>Interval</FormLabel>
                <FormControl>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    value={field.value}
                    disabled={isSubmitting}
                  >
                    <SelectTrigger>
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
                <FormDescription>
                  The amount of time contained by each candlestick bar
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              validate: {
                required: (value) => (value.length ? true : 'Select a valid interval'),
              },
            }}
          />

          <FormField
            control={form.control}
            name='requirement'
            render={({ field }) => (
              <FormItem className='mt-5'>
                <FormLabel>State requirement%</FormLabel>
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
                <FormDescription>
                  The price% change required in a window split to be stateful (1 | -1)
                </FormDescription>
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
              <FormItem className='mt-5'>
                <FormLabel>Strong state requirement%</FormLabel>
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
                <FormDescription>
                  The price% change required in a window split to have a strong state (2 | -2)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
            rules={{
              validate: {
                required: (value) => (numberValid(Number(value), 0.01, 100) ? true : 'Enter a number ranging 0.01% - 100%'),
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
          <DialogDescription>
            The changes will be applied immediately upon submission
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
