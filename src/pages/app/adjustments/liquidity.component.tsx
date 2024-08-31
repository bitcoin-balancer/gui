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
  FormLabel,
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
import { LiquidityService, ILiquidityConfig } from '@/shared/backend/market-state/liquidity/index.service.ts';
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
type ILiquidityForm = {
  maxDistanceFromPrice: string;
  intensityWeight1: string;
  intensityWeight2: string;
  intensityWeight3: string;
  intensityWeight4: string;
};

// the props required by an intensity weight input
type IIntesityWeightInput = {
  name: 'intensityWeight1' | 'intensityWeight2' | 'intensityWeight3' | 'intensityWeight4';
  label: string;
  placeholder: string;
  subTitle: string;
};





/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of intensity weights that can be configured
const INTENSITY_WEIGHT_INPUTS: IIntesityWeightInput[] = [
  { name: 'intensityWeight1', label: 'Intensity 1', placeholder: '1', subTitle: 'Low intensity' },
  { name: 'intensityWeight2', label: 'Intensity 2', placeholder: '3', subTitle: 'Medium intensity' },
  { name: 'intensityWeight3', label: 'Intensity 3', placeholder: '6', subTitle: 'High intensity' },
  { name: 'intensityWeight4', label: 'Intensity 4', placeholder: '12', subTitle: 'Very high intensity' },
];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity Component
 * Component in charge of updating the liquidity's configuration.
 */
const Liquidity = ({ closeDialog }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<ILiquidityConfig>(useMemo(
    () => ({
      fetchFunc: { func: LiquidityService.getConfig },
    }),
    [],
  ));
  const form = useForm<ILiquidityForm>({
    defaultValues: {
      maxDistanceFromPrice: '',
      intensityWeight1: '',
      intensityWeight2: '',
      intensityWeight3: '',
      intensityWeight4: '',
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
      form.setValue('maxDistanceFromPrice', String(data.maxDistanceFromPrice));
      form.setValue('intensityWeight1', String(data.intensityWeights[1]));
      form.setValue('intensityWeight2', String(data.intensityWeights[2]));
      form.setValue('intensityWeight3', String(data.intensityWeights[3]));
      form.setValue('intensityWeight4', String(data.intensityWeights[4]));
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
  const onSubmit = (formData: ILiquidityForm): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update liquidity\'s configuration',
      description: 'The new configuration will be applied immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await LiquidityService.updateConfig(
            {
              maxDistanceFromPrice: Number(formData.maxDistanceFromPrice),
              intensityWeights: {
                1: Number(formData.intensityWeight1),
                2: Number(formData.intensityWeight2),
                3: Number(formData.intensityWeight3),
                4: Number(formData.intensityWeight4),
              },
            },
            confirmation,
          );
          handleCloseDialog();
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 22501) {
            form.setError('maxDistanceFromPrice', { message });
          }
          if (code === 22502) {
            form.setError('intensityWeight1', { message });
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
              name='maxDistanceFromPrice'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Max distance% from price'
                    description={[
                      'The interval at which the pricing data is re-fetched from the exchange.',
                      '-----',
                      'When using Kraken, ensure your request frequency respects their strict rate limits.  Setting a value larger than 10 seconds for your request interval is recommended to avoid hitting rate limits and ensure smooth operation.',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='0.35'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={0.01}
                      max={100}
                      />
                  </FormControl>
                  <FormDescription>Price range size%</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 0.01, 100) ? true : 'Enter a number ranging 0.01 - 100'),
                },
              }}
            />
          </fieldset>


          <Separator className='my-10' />


          <fieldset>
            <h3 className='text-md font-semibold'>Intensity weights</h3>

            <div
              className='grid grid-cols-2 gap-4'
            >

            {INTENSITY_WEIGHT_INPUTS.map((item, i) => (
              <FormField
                key={i}
                control={form.control}
                name={item.name}
                render={({ field }) => (
                  <FormItem className='mt-7'>
                    <FormLabel>{item.label}</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder={item.placeholder}
                        {...field}
                        autoComplete='off'
                        disabled={isSubmitting}
                        min={1}
                        max={100}
                        />
                    </FormControl>
                    <FormDescription className='text-xs'>{item.subTitle}</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (numberValid(Number(value), 1, 100) ? true : 'Enter an integer ranging 1 - 100'),
                  },
                }}
              />
            ))}

            </div>

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
          <DialogTitle>Update Liquidity</DialogTitle>
          <DialogDescription className='flex justify-center items-center sm:justify-start'>
            Connected to
            <img
              src={`/exchanges/${exchangeConfig.liquidity}.png`}
              alt={`Logo of the Exchange being used by the Liquidity Module (${exchangeConfig.liquidity})`}
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
export default Liquidity;
