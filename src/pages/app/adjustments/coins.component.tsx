import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import { Textarea } from '@/shared/shadcn/components/ui/textarea.tsx';
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
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import {
  integerValid,
  numberValid,
  stringValid,
  symbolValid,
} from '@/shared/backend/validations/index.service.ts';
import {
  CoinsService,
  ICoinsConfig,
  ICoinsConfigGUI,
} from '@/shared/backend/market-state/coins/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import FormLabelWithMoreInfo from '@/shared/components/form-label-with-more-info/index.component.tsx';
import { IFormProps } from '@/pages/app/adjustments/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Ensures the whitelist string is valid.
 * @param whitelist
 * @param baseAsset
 * @returns boolean
 */
const isWhitelistValid = (whitelist: string, baseAsset: string): boolean => {
  if (stringValid(whitelist, 3)) {
    const symbols = whitelist.split(',');
    return symbols.includes(baseAsset) && symbols.every(symbolValid);
  }
  return false;
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins Component
 * Component in charge of updating the coins's configuration.
 */
const Coins = ({ open, onOpenChange }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch<ICoinsConfig>(useMemo(
    () => ({
      fetchFunc: { func: CoinsService.getConfig },
    }),
    [],
  ));
  const form = useForm<ICoinsConfigGUI>({
    defaultValues: {
      size: data?.size ?? '',
      interval: data?.interval ?? '',
      requirement: data?.requirement ?? '',
      strongRequirement: data?.strongRequirement ?? '',
      limit: data?.limit ?? '',
      whitelistedSymbolsStr: data?.whitelistedSymbols.join(',') ?? '',
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
      form.setValue('size', data.size);
      form.setValue('interval', data.interval);
      form.setValue('requirement', data.requirement);
      form.setValue('strongRequirement', data.strongRequirement);
      form.setValue('limit', data.limit);
      form.setValue('whitelistedSymbolsStr', data.whitelistedSymbols.join(','));
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
  const onSubmit = (formData: ICoinsConfigGUI): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update coins\'s configuration',
      description: 'The new configuration will be applied immediately upon submission and the state of the coins will be reset.',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await CoinsService.updateConfig(
            {
              size: Number(formData.size),
              interval: Number(formData.interval),
              requirement: Number(formData.requirement),
              strongRequirement: Number(formData.strongRequirement),
              limit: Number(formData.limit),
              whitelistedSymbols: formData.whitelistedSymbolsStr.split(','),
            },
            confirmation,
          );
          onOpenChange(false);
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 23501) {
            form.setError('size', { message });
          }
          if (code === 23502) {
            form.setError('interval', { message });
          }
          if (code === 23503 || code === 23511) {
            form.setError('requirement', { message });
          }
          if (code === 23504) {
            form.setError('strongRequirement', { message });
          }
          if (code === 23507) {
            form.setError('limit', { message });
          }
          if (code === 23505 || code === 23506 || code === 23509) {
            form.setError('whitelistedSymbolsStr', { message });
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
              name='size'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Size'
                    description='The number of price items that comprise the window for each coin.'
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
                  <FormDescription>Price items quantity</FormDescription>
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
                    description='The number of seconds each price item will last before appending a new one.'
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='15'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={5}
                      max={3600}
                      />
                  </FormControl>
                  <FormDescription>Price item duration in seconds</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 5, 3600) ? true : 'Enter a number ranging 5 - 3600'),
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
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='State requirement%'
                    description={[
                      'The percentage change in a coin\'s price needed to mark a window split as "stateful". ',
                      'The possible states for this requirement are:',
                      ' 1: increasing',
                      '-1: decreasing',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.01'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={0.01}
                      max={100}
                      />
                  </FormControl>
                  <FormDescription>Coin's price% change</FormDescription>
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
                      'The percentage change in a coin\'s price needed to mark a window split as "stateful". ',
                      'The possible states for this requirement are:',
                      ' 2: increasing strongly',
                      '-2: decreasing strongly',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.3'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={0.01}
                      max={100}
                      />
                  </FormControl>
                  <FormDescription>Coins's price% change</FormDescription>
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

          <Separator className='my-10' />

          <fieldset>
            <h3 className='text-md font-semibold'>Symbols</h3>

            <FormField
              control={form.control}
              name='limit'
              render={({ field }) => (
                <FormItem className='mt-5'>
                  <FormLabelWithMoreInfo
                    value='Limit'
                    description='The maximum number of coins that will be selected based on the whitelist and their volume.'
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='24'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={1}
                      max={24}
                      />
                  </FormControl>
                  <FormDescription>Maximum number of symbols</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (integerValid(Number(value), 1, 24) ? true : 'Enter a number ranging 1 - 24'),
                },
              }}
            />

            <FormField
              control={form.control}
              name='whitelistedSymbolsStr'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Whitelist'
                    description='The list of symbols that can be selected by the system.'
                  />
                  <FormControl>
                    <Textarea
                      placeholder='BTC,ETH,BNB,XRP,...'
                      rows={7}
                      autoComplete='false'
                      spellCheck='false'
                      {...field}
                      disabled={isSubmitting}
                    />
                  </FormControl>
                  <FormDescription>Top symbols by market capital</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (!isWhitelistValid(value, exchangeConfig.baseAsset) ? `Enter a valid list of whitelisted symbols separated by commas. Also make sure to include the base asset (${exchangeConfig.baseAsset})` : true),
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
          <DialogTitle>Update Coins</DialogTitle>
          <DialogDescription className='flex justify-center items-center sm:justify-start'>
            Connected to
            <img
              src={`/exchanges/${exchangeConfig.coins}.png`}
              alt={`Logo of the Exchange being used by the Coins Module (${exchangeConfig.coins})`}
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
export default Coins;
