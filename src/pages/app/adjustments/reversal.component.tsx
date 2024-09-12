/* eslint-disable object-curly-newline */
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
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
import { integerValid, numberValid } from '@/shared/backend/validations/index.service.ts';
import { ReversalService, IReversalConfig } from '@/shared/backend/market-state/reversal/index.service';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import FormLabelWithMoreInfo from '@/shared/components/form-label-with-more-info/index.component.tsx';
import { IFormProps } from '@/pages/app/adjustments/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the structure that will be used to mutate the configuration
type IReversalForm = {
  crashDuration: string;
  pointsRequirement: string;
  liquidityWeight: string;
  coinsQuoteWeight: string;
  coinsBaseWeight: string;
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Reversal Component
 * Component in charge of updating the reversal's configuration.
 */
const Reversal = ({ closeDialog }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<IReversalConfig>(useMemo(
    () => ({
      fetchFunc: { func: ReversalService.getConfig },
    }),
    [],
  ));
  const form = useForm<IReversalForm>({
    defaultValues: {
      crashDuration: '',
      pointsRequirement: '',
      liquidityWeight: '',
      coinsQuoteWeight: '',
      coinsBaseWeight: '',
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
      form.setValue('crashDuration', String(data.crashDuration));
      form.setValue('pointsRequirement', String(data.pointsRequirement));
      form.setValue('liquidityWeight', String(data.weights.liquidity));
      form.setValue('coinsQuoteWeight', String(data.weights.coinsQuote));
      form.setValue('coinsBaseWeight', String(data.weights.coinsBase));
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
  const onSubmit = (formData: IReversalForm): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update reversal\'s configuration',
      description: 'The new configuration will be applied immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await ReversalService.updateConfig(
            {
              crashDuration: Number(formData.crashDuration),
              pointsRequirement: Number(formData.pointsRequirement),
              weights: {
                liquidity: Number(formData.liquidityWeight),
                coinsQuote: Number(formData.coinsQuoteWeight),
                coinsBase: Number(formData.coinsBaseWeight),
              },
            },
            confirmation,
          );
          handleCloseDialog();
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 24501) {
            form.setError('crashDuration', { message });
          }
          if (code === 24503) {
            form.setError('pointsRequirement', { message });
          }
          if (code === 24505) {
            form.setError('liquidityWeight', { message });
          }
          if (code === 24506) {
            form.setError('coinsQuoteWeight', { message });
          }
          if (code === 24507) {
            form.setError('coinsBaseWeight', { message });
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
            <h3 className='text-md font-semibold'>General</h3>

            <FormField
              control={form.control}
              name='crashDuration'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Crash duration'
                    description={[
                      'The number of minutes the price crash state will be active for. Once the time runs out, the record is stored in the database and the state is reset.',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='120'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={5}
                      max={10080}
                      />
                  </FormControl>
                  <FormDescription>Number of minutes</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (integerValid(Number(value), 5, 10080) ? true : 'Enter an integer ranging 5 - 10080'),
                },
              }}
            />

          </fieldset>


          <Separator className='my-10' />

          <fieldset>

            <h3 className='text-md font-semibold'>Reversal event</h3>

            <FormField
                control={form.control}
                name='pointsRequirement'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Points requirement'
                      description={[
                        'The total number of points required for a reversal event to be issued.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='75'
                        {...field}
                        autoComplete='off'
                        disabled={isSubmitting}
                        min={50}
                        max={100}
                        />
                    </FormControl>
                    <FormDescription>Number of points</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 50, 100) ? true : 'Enter a number ranging 0 - 1440'),
                  },
                }}
              />
          </fieldset>


          <Separator className='my-10' />



          <fieldset>

            <h3 className='text-md font-semibold'>Weights</h3>


            <FormField
                control={form.control}
                name='liquidityWeight'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value='Liquidity'
                      description={[
                        'The maximum number of points that can be obtained via the liquidity module.',
                        'This module directly correlates with buying pressure, yielding more points as buying pressure intensifies.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='35'
                        {...field}
                        autoComplete='off'
                        disabled={isSubmitting}
                        min={50}
                        max={100}
                        />
                    </FormControl>
                    <FormDescription>Number of points</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 1, 100) ? true : 'Enter a number ranging 1 - 100'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='coinsQuoteWeight'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value={`Coins quote (COINS/${exchangeConfig.quoteAsset})`}
                      description={[
                        'The maximum number of points that can be obtained via the coins module (COINS/USDT).',
                        'This module directly correlates with buying pressure, yielding more points as buying pressure intensifies.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='35'
                        {...field}
                        autoComplete='off'
                        disabled={isSubmitting}
                        min={1}
                        max={100}
                        />
                    </FormControl>
                    <FormDescription>Number of points</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 1, 100) ? true : 'Enter a number ranging 1 - 100'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='coinsBaseWeight'
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabelWithMoreInfo
                      value={`Coins base (COINS/${exchangeConfig.baseAsset})`}
                      description={[
                        'The maximum number of points that can be obtained via the coins module (COINS/BTC)',
                        'This module directly correlates with buying pressure, yielding more points as buying pressure intensifies.',
                      ]}
                    />
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='30'
                        {...field}
                        autoComplete='off'
                        disabled={isSubmitting}
                        min={1}
                        max={100}
                        />
                    </FormControl>
                    <FormDescription>Number of points</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 1, 100) ? true : 'Enter a number ranging 1 - 100'),
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
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Update Reversal</DialogTitle>
          <DialogDescription>
          The new configuration will be applied immediately upon submission
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
export default Reversal;
