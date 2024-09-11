/* eslint-disable object-curly-newline */
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CircleHelp, Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import { Switch } from '@/shared/shadcn/components/ui/switch.tsx';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { numberValid } from '@/shared/backend/validations/index.service.ts';
import {
  StrategyService,
  IDecreaseLevelID,
  IDecreaseLevels,
  IStrategy,
} from '@/shared/backend/position/strategy/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
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
type IStrategyForm = {
  canIncrease: boolean;
  canDecrease: boolean;
  minPositionAmountQuote: string;
  increaseAmountQuote: string;
  increaseIdleDuration: string;
  increaseGainRequirement: string;
  gainRequirement0: string;
  percentage0: string;
  frequency0: string;
  gainRequirement1: string;
  percentage1: string;
  frequency1: string;
  gainRequirement2: string;
  percentage2: string;
  frequency2: string;
  gainRequirement3: string;
  percentage3: string;
  frequency3: string;
  gainRequirement4: string;
  percentage4: string;
  frequency4: string;
};

// the props required by a decrease level input
type IDecreaseLevelName = `gainRequirement${IDecreaseLevelID}` | `percentage${IDecreaseLevelID}` | `frequency${IDecreaseLevelID}`;
type IDecreaseLevelInput = {
  name: IDecreaseLevelName;
  placeholder: string;
};

// the input lists
type IInputList = [
  IDecreaseLevelInput,
  IDecreaseLevelInput,
  IDecreaseLevelInput,
  IDecreaseLevelInput,
  IDecreaseLevelInput,
];




/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the maximum value allowed for the gainRequirement property
const MAX_GAIN_REQUIREMENT = 1000000;

// the maximum value allowed for decrease levels (~30 days)
const MAX_FREQUENCY = 43200;

// the form object in pristine state
const PRISTINE_FORM: IStrategyForm = {
  canIncrease: true,
  canDecrease: true,
  minPositionAmountQuote: '',
  increaseAmountQuote: '',
  increaseIdleDuration: '',
  increaseGainRequirement: '',
  gainRequirement0: '',
  percentage0: '',
  frequency0: '',
  gainRequirement1: '',
  percentage1: '',
  frequency1: '',
  gainRequirement2: '',
  percentage2: '',
  frequency2: '',
  gainRequirement3: '',
  percentage3: '',
  frequency3: '',
  gainRequirement4: '',
  percentage4: '',
  frequency4: '',
};

// the list of gainRequirements
const GAIN_REQUIREMENTS: IInputList = [
  { name: 'gainRequirement0', placeholder: '0.50' },
  { name: 'gainRequirement1', placeholder: '1.50' },
  { name: 'gainRequirement2', placeholder: '2.50' },
  { name: 'gainRequirement3', placeholder: '3.50' },
  { name: 'gainRequirement4', placeholder: '5.00' },
];

// the list of percentages
const PERCENTAGES: IInputList = [
  { name: 'percentage0', placeholder: '0.50' },
  { name: 'percentage1', placeholder: '1.50' },
  { name: 'percentage2', placeholder: '2.50' },
  { name: 'percentage3', placeholder: '3.50' },
  { name: 'percentage4', placeholder: '5.00' },
];

// the list of frequencies
const FREQUENCIES: IInputList = [
  { name: 'frequency0', placeholder: '240' },
  { name: 'frequency1', placeholder: '120' },
  { name: 'frequency2', placeholder: '80' },
  { name: 'frequency3', placeholder: '30' },
  { name: 'frequency4', placeholder: '10' },
];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Strategy Component
 * Component in charge of updating the strategy.
 */
const Strategy = ({ closeDialog }: IFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch<IStrategy>(useMemo(
    () => ({
      fetchFunc: { func: StrategyService.getConfig },
    }),
    [],
  ));
  const form = useForm<IStrategyForm>({ defaultValues: PRISTINE_FORM });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  useEffect(() => {
    if (data) {
      form.setValue('canIncrease', data.canIncrease);
      form.setValue('canDecrease', data.canIncrease);
      form.setValue('minPositionAmountQuote', String(data.minPositionAmountQuote));
      form.setValue('increaseAmountQuote', String(data.increaseAmountQuote));
      form.setValue('increaseIdleDuration', String(data.increaseIdleDuration));
      form.setValue('increaseGainRequirement', String(data.increaseGainRequirement));
      data.decreaseLevels.forEach((level, i) => {
        form.setValue(`gainRequirement${i as IDecreaseLevelID}`, String(level.gainRequirement));
        form.setValue(`percentage${i as IDecreaseLevelID}`, String(level.percentage));
        form.setValue(`frequency${i as IDecreaseLevelID}`, String(level.frequency));
      });
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
  const onSubmit = (formData: IStrategyForm): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update strategy',
      description: 'The new configuration will be applied immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await StrategyService.updateConfig(
            {
              canIncrease: formData.canIncrease,
              canDecrease: formData.canIncrease,
              minPositionAmountQuote: Number(formData.minPositionAmountQuote),
              increaseAmountQuote: Number(formData.increaseAmountQuote),
              increaseIdleDuration: Number(formData.increaseIdleDuration),
              increaseGainRequirement: Number(formData.increaseGainRequirement),
              decreaseLevels: GAIN_REQUIREMENTS.map((_val, i) => ({
                gainRequirement: Number(formData[`gainRequirement${i as IDecreaseLevelID}`]),
                percentage: Number(formData[`percentage${i as IDecreaseLevelID}`]),
                frequency: Number(formData[`frequency${i as IDecreaseLevelID}`]),
              })) as IDecreaseLevels,
            },
            confirmation,
          );
          handleCloseDialog();
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 31501) {
            form.setError('canIncrease', { message });
          }
          if (code === 31502) {
            form.setError('canDecrease', { message });
          }
          if (code === 31503) {
            form.setError('increaseAmountQuote', { message });
          }
          if (code === 31504) {
            form.setError('minPositionAmountQuote', { message });
          }
          if (code === 31505) {
            form.setError('increaseIdleDuration', { message });
          }
          if (code === 31506) {
            form.setError('increaseGainRequirement', { message });
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
            <h3 className='text-md font-semibold'>Status</h3>

            <div
              className='flex flex-col sm:flex-row justify-evenly items-start sm:items-center gap-3 mt-5'
            >

              <FormField
                control={form.control}
                name='canIncrease'
                render={({ field }) => (
                  <FormItem
                    className='flex items-end justify-start gap-2'
                  >
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-base'>Auto-increase</FormLabel>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name='canDecrease'
                render={({ field }) => (
                  <FormItem
                    className='flex items-end justify-start gap-2'
                  >
                    <FormControl>
                      <Switch
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
                    </FormControl>
                    <FormLabel className='text-base'>Auto-decrease</FormLabel>
                  </FormItem>
                )}
              />

            </div>
          </fieldset>

          <Separator className='my-10' />


          <fieldset>
            <h3 className='text-md font-semibold'>General</h3>

            <FormField
              control={form.control}
              name='minPositionAmountQuote'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value={'Min. position amount'}
                    description={[
                      `If the position's amount (${exchangeConfig.quoteAsset}) is decreased to this value or less, it will be completely closed on the next decrease action.`,
                      'This value must range between 15% - 65% of the "Increase amount".',
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
                      max={Number.MAX_SAFE_INTEGER}
                      />
                  </FormControl>
                  <FormDescription>{exchangeConfig.quoteAsset} amount</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 1, Number.MAX_SAFE_INTEGER) ? true : `Enter a number ranging 1 - ${Number.MAX_SAFE_INTEGER}`),
                },
              }}
            />
          </fieldset>

          <Separator className='my-10' />

          <fieldset>
            <h3 className='text-md font-semibold'>Increase</h3>

            <FormField
              control={form.control}
              name='increaseAmountQuote'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Amount'
                    description={[
                      `The amount of quote asset (${exchangeConfig.quoteAsset}) that will be used to open/increase positions.`,
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='100'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={1}
                      max={Number.MAX_SAFE_INTEGER}
                      />
                  </FormControl>
                  <FormDescription>{exchangeConfig.quoteAsset} amount</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 1, Number.MAX_SAFE_INTEGER) ? true : `Enter a number ranging 1 - ${Number.MAX_SAFE_INTEGER}`),
                },
              }}
            />


            <FormField
              control={form.control}
              name='increaseIdleDuration'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Idle duration'
                    description={[
                      'The number of hours Balancer will before before being able to increase the position again',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='72'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={1}
                      max={1440}
                      />
                  </FormControl>
                  <FormDescription>Number of hours</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), 1, 1440) ? true : 'Enter a number ranging 1 - 1440'),
                },
              }}
            />


            <FormField
              control={form.control}
              name='increaseGainRequirement'
              render={({ field }) => (
                <FormItem className='mt-7'>
                  <FormLabelWithMoreInfo
                    value='Gain requirement%'
                    description={[
                      'The position must be at a loss of at least "Gain requirement%" to be able to increase.',
                      'Setting 0 disables this functionality. Meaning that the position can be increased on every reversal event regardless of the gain state.',
                    ]}
                  />
                  <FormControl>
                    <Input
                      type='number'
                      placeholder='-3'
                      {...field}
                      autoComplete='off'
                      disabled={isSubmitting}
                      min={-99}
                      max={0}
                      />
                  </FormControl>
                  <FormDescription>Size of the loss</FormDescription>
                  <FormMessage />
                </FormItem>
              )}
              rules={{
                validate: {
                  required: (value) => (numberValid(Number(value), -99, 0) ? true : 'Enter a number ranging -99% - 0%'),
                },
              }}
            />

          </fieldset>


          <Separator className='my-10' />


          <fieldset>

            <div
              className='flex justify-start items-center'
            >
              <h3 className='text-md font-semibold'>Decrease levels</h3>

              <span className='flex-1'></span>

              <Tooltip>
                <TooltipTrigger
                  className='w-5 h-5'
                  type='button'
                  aria-label='View more information'
                  onClick={() => openInfoDialog({
                    title: 'Decrease levels',
                    content: [
                      '@TODO',
                    ],
                  })}
                  tabIndex={-1}
                >
                  <CircleHelp
                    className='w-5 h-5'
                    aria-hidden='true'
                  />
                </TooltipTrigger>
                <TooltipContent side='left'><p>More info</p></TooltipContent>
              </Tooltip>
            </div>


            {
              GAIN_REQUIREMENTS.map((gainRequirement, i) => (
                <div
                  key={i}
                  className='flex justify-start items-center gap-3'
                >
                  <h4 className='font-semibold'>#{i}</h4>

                  <FormField
                    control={form.control}
                    name={gainRequirement.name}
                    render={({ field }) => (
                      <FormItem className='mt-7 flex-1'>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder={gainRequirement.placeholder}
                            {...field}
                            autoComplete='off'
                            disabled={isSubmitting}
                            min={0.1}
                            max={MAX_GAIN_REQUIREMENT}
                            />
                        </FormControl>
                        <FormDescription className='text-xs'>
                          {breakpoint === 'xs' ? 'Gain req.%' : 'Gain requirement%'}
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                    rules={{
                      validate: {
                        required: (value) => (numberValid(Number(value), 0.1, MAX_GAIN_REQUIREMENT) ? true : `Enter a number ranging 0.1 - ${MAX_GAIN_REQUIREMENT}`),
                      },
                    }}
                  />

                  <FormField
                    control={form.control}
                    name={PERCENTAGES[i].name}
                    render={({ field }) => (
                      <FormItem className='mt-7 flex-1'>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder={PERCENTAGES[i].placeholder}
                            {...field}
                            autoComplete='off'
                            disabled={isSubmitting}
                            min={1}
                            max={100}
                            />
                        </FormControl>
                        <FormDescription className='text-xs'>Percentage</FormDescription>
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
                    name={FREQUENCIES[i].name}
                    render={({ field }) => (
                      <FormItem className='mt-7 flex-1'>
                        <FormControl>
                          <Input
                            type='number'
                            placeholder={FREQUENCIES[i].placeholder}
                            {...field}
                            autoComplete='off'
                            disabled={isSubmitting}
                            min={1}
                            max={MAX_FREQUENCY}
                            />
                        </FormControl>
                        <FormDescription className='text-xs'>Frequency</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                    rules={{
                      validate: {
                        required: (value) => (numberValid(Number(value), 1, MAX_FREQUENCY) ? true : `Enter a number ranging 1 - ${MAX_FREQUENCY}`),
                      },
                    }}
                  />

                </div>
              ))
            }

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
          <DialogTitle>Update Strategy</DialogTitle>
          <DialogDescription className='flex justify-center items-center sm:justify-start'>
            Connected to
            <img
              src={`/exchanges/${exchangeConfig.trading}.png`}
              alt={`Logo of the Exchange being used by the Strategy Module (${exchangeConfig.trading})`}
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
export default Strategy;
