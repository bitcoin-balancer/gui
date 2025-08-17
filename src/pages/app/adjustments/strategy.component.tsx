/* eslint-disable object-curly-newline */
import { useState, useMemo, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { CircleHelp, Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { isIntegerValid, isNumberValid } from 'web-utils-kit';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/shadcn/components/ui/select.tsx';
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn/components/ui/tabs.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { ENVIRONMENT } from '@/environment/environment.ts';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import {
  StrategyService,
  IDecreaseLevelID,
  IDecreaseLevels,
  IIncreaseIdleMode,
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
  increaseAmountQuote: string;
  increaseGainRequirement: string;
  increaseIdleDuration: string;
  increaseIdleMode: IIncreaseIdleMode;
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
type IDecreaseLevelName =
  | `gainRequirement${IDecreaseLevelID}`
  | `percentage${IDecreaseLevelID}`
  | `frequency${IDecreaseLevelID}`;
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

// To prevent automatic closure of positions, ensure the quote asset amount used to buy BTC always
// exceeds PositionService.__MIN_ORDER_SIZE. Positions with a quote asset amount below this
// threshold will be automatically closed at the database level, without selling the BTC
// For example, a __MIN_INCREASE_AMOUNT_QUOTE will only work until BTC is worth $500,000.
// 0.0002 * 500000 = 100
const __MIN_INCREASE_AMOUNT_QUOTE = ENVIRONMENT.production ? 100 : 25;

// the form object in pristine state
const PRISTINE_FORM: IStrategyForm = {
  canIncrease: true,
  canDecrease: true,
  increaseAmountQuote: '',
  increaseGainRequirement: '',
  increaseIdleDuration: '',
  increaseIdleMode: '' as IIncreaseIdleMode,
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
  { name: 'gainRequirement0', placeholder: '1.50' },
  { name: 'gainRequirement1', placeholder: '3.50' },
  { name: 'gainRequirement2', placeholder: '5.50' },
  { name: 'gainRequirement3', placeholder: '7.50' },
  { name: 'gainRequirement4', placeholder: '10.00' },
];

// the list of percentages
const PERCENTAGES: IInputList = [
  { name: 'percentage0', placeholder: '5.00' },
  { name: 'percentage1', placeholder: '10.00' },
  { name: 'percentage2', placeholder: '17.50' },
  { name: 'percentage3', placeholder: '25.00' },
  { name: 'percentage4', placeholder: '35.00' },
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
  const { data, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => StrategyService.getConfig(),
      }),
      [],
    ),
  );
  const { setValue, ...form } = useForm<IStrategyForm>({ defaultValues: PRISTINE_FORM });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const { authority } = useBoundStore((state) => state.user!);

  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  useEffect(() => {
    if (data) {
      setValue('canIncrease', data.canIncrease);
      setValue('canDecrease', data.canDecrease);
      setValue('increaseAmountQuote', String(data.increaseAmountQuote));
      setValue('increaseGainRequirement', String(data.increaseGainRequirement));
      setValue('increaseIdleDuration', String(data.increaseIdleDuration));
      setValue('increaseIdleMode', data.increaseIdleMode);
      data.decreaseLevels.forEach((level, i) => {
        setValue(`gainRequirement${i as IDecreaseLevelID}`, String(level.gainRequirement));
        setValue(`percentage${i as IDecreaseLevelID}`, String(level.percentage));
        setValue(`frequency${i as IDecreaseLevelID}`, String(level.frequency));
      });
    }
  }, [data, setValue]);

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
              canDecrease: formData.canDecrease,
              increaseAmountQuote: Number(formData.increaseAmountQuote),
              increaseGainRequirement: Number(formData.increaseGainRequirement),
              increaseIdleDuration: Number(formData.increaseIdleDuration),
              increaseIdleMode: formData.increaseIdleMode,
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
          if (code === 31506) {
            form.setError('increaseGainRequirement', { message });
          }
          if (code === 31505) {
            form.setError('increaseIdleDuration', { message });
          }
          if (code === 31511) {
            form.setError('increaseIdleMode', { message });
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
    content = (
      <PageLoadError
        variant="dialog"
        error={error}
      />
    );
  } else if (loading) {
    content = <PageLoader variant="dialog" />;
  } else {
    content = (
      <Form
        setValue={setValue}
        {...form}
      >
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          noValidate
        >
          <Tabs
            defaultValue="increase"
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="increase">Increase</TabsTrigger>
              <TabsTrigger value="decrease">Decrease</TabsTrigger>
            </TabsList>

            {/* **********
             * INCREASE *
             ********** */}
            <TabsContent value="increase">
              <fieldset className="mt-3 animate-in fade-in duration-700">
                <div className="flex justify-start items-center">
                  <h3 className="text-md font-semibold">Status</h3>

                  <span className="flex-1"></span>

                  <Tooltip>
                    <TooltipTrigger
                      className="w-5 h-5"
                      type="button"
                      aria-label="View more information"
                      onClick={() =>
                        openInfoDialog({
                          title: 'Status',
                          content: [
                            'If enabled, Balancer will open and increase positions automatically based on the state of the market and the state of the position.',
                            'Keep in mind that manual actions can still be taken if disabled.',
                          ],
                        })
                      }
                      tabIndex={-1}
                    >
                      <CircleHelp
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>More info</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <FormField
                  control={form.control}
                  name="canIncrease"
                  render={({ field }) => (
                    <FormItem className="flex items-end justify-start gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-base">Auto-increase</FormLabel>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="increaseAmountQuote"
                  render={({ field }) => (
                    <FormItem className="mt-7">
                      <FormLabelWithMoreInfo
                        value="Amount"
                        description={[
                          `The amount of quote asset (${exchangeConfig.quoteAsset}) that will be used to open/increase positions.`,
                        ]}
                      />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="3500"
                          {...field}
                          autoComplete="off"
                          disabled={isSubmitting}
                          min={20}
                          max={Number.MAX_SAFE_INTEGER}
                        />
                      </FormControl>
                      <FormDescription>{exchangeConfig.quoteAsset} value</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    validate: {
                      required: (value) =>
                        isNumberValid(
                          Number(value),
                          __MIN_INCREASE_AMOUNT_QUOTE,
                          Number.MAX_SAFE_INTEGER,
                        )
                          ? true
                          : `Enter a number ranging ${__MIN_INCREASE_AMOUNT_QUOTE} - ${Number.MAX_SAFE_INTEGER}`,
                    },
                  }}
                />

                <FormField
                  control={form.control}
                  name="increaseGainRequirement"
                  render={({ field }) => (
                    <FormItem className="mt-7">
                      <FormLabelWithMoreInfo
                        value="Gain requirement%"
                        description={[
                          'The position must be at a loss of at least "Gain requirement%" to be increasable.',
                          `For example, say the "Gain requirement%" is set at -10%, and a position opens at $1,000/${exchangeConfig.baseAsset}. For it to be increasable, the price of ${exchangeConfig.baseAsset} must drop to at least $900.`,
                          'Setting 0 disables this functionality. Meaning that the position can be increased on every reversal event regardless of the gain state.',
                        ]}
                      />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="-3"
                          {...field}
                          autoComplete="off"
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
                      required: (value) =>
                        isNumberValid(Number(value), -99, 0)
                          ? true
                          : 'Enter a number ranging -99% - 0%',
                    },
                  }}
                />

                <FormField
                  control={form.control}
                  name="increaseIdleDuration"
                  render={({ field }) => (
                    <FormItem className="mt-7">
                      <FormLabelWithMoreInfo
                        value="Idle duration"
                        description={[
                          'The number of hours Balancer will wait before being able to increase the position again.',
                          'For example, if the "Idle duration" is set to 24 hours and a position is opened on Monday at 2 pm, Balancer won\'t be able to increase the position until Tuesday at 2 pm regardless of the state of the market.',
                        ]}
                      />
                      <FormControl>
                        <Input
                          type="number"
                          placeholder="48"
                          {...field}
                          autoComplete="off"
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
                      required: (value) =>
                        isNumberValid(Number(value), 1, 1440)
                          ? true
                          : 'Enter a number ranging 1 - 1440',
                    },
                  }}
                />

                <FormField
                  control={form.control}
                  name="increaseIdleMode"
                  render={({ field }) => (
                    <FormItem className="mt-7">
                      <FormLabelWithMoreInfo
                        value="Idle mode"
                        description={[
                          "Balancer's Idle mode governs the waiting period before a position can be increased. Two modes are supported:",
                          '- Incremental: the waiting period is "Idle duration" multiplied by the number of previous increases. For example, with "Idle duration" set to 24 hours and 5 previous increases, the wait time becomes 120 hours (24 * 5).',
                          '- Fixed: the waiting period is always "Idle duration", regardless of the number of previous increases.',
                        ]}
                        htmlFor="idleModeSelect"
                      />
                      <FormControl>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          value={field.value}
                          disabled={isSubmitting}
                          name="idleModeSelect"
                        >
                          <SelectTrigger id="idleModeSelect">
                            <SelectValue placeholder="Select one option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="incremental">Incremental</SelectItem>
                            <SelectItem value="fixed">Fixed</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormDescription>Type of delay</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                  rules={{
                    validate: {
                      required: (value) => (value.length ? true : 'Select a valid mode'),
                    },
                  }}
                />
              </fieldset>
            </TabsContent>

            {/* **********
             * DECREASE *
             ********** */}
            <TabsContent value="decrease">
              <fieldset className="mt-3 animate-in fade-in duration-700">
                <div className="flex justify-start items-center">
                  <h3 className="text-md font-semibold">Status</h3>

                  <span className="flex-1"></span>

                  <Tooltip>
                    <TooltipTrigger
                      className="w-5 h-5"
                      type="button"
                      aria-label="View more information"
                      onClick={() =>
                        openInfoDialog({
                          title: 'Status',
                          content: [
                            'If enabled, Balancer will decrease positions automatically based on the state of the market and the state of the position.',
                            'Keep in mind that manual actions can still be taken if disabled.',
                          ],
                        })
                      }
                      tabIndex={-1}
                    >
                      <CircleHelp
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>More info</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                <FormField
                  control={form.control}
                  name="canDecrease"
                  render={({ field }) => (
                    <FormItem className="flex items-end justify-start gap-2">
                      <FormControl>
                        <Switch
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-base">Auto-decrease</FormLabel>
                    </FormItem>
                  )}
                />

                <div className="flex justify-start items-center mt-7">
                  <h3 className="text-md font-semibold">Levels</h3>

                  <span className="flex-1"></span>

                  <Tooltip>
                    <TooltipTrigger
                      className="w-5 h-5"
                      type="button"
                      aria-label="View more information"
                      onClick={() =>
                        openInfoDialog({
                          title: 'Decrease levels',
                          content: [
                            "The position decrease schedule is comprised of 5 levels that are activated based on the position's gain. Each level has the following properties:",
                            'Gain requirement%: the gain required for the level to be active.',
                            'Percentage: the percentage of the position amount that will be decreased when the level is active and conditions apply.',
                            'Frequency: the number of minutes in which the interval will continue to decrease the position (as long as the conditions are met).',
                            '-----',
                            'EXAMPLE',
                            'Level 0: 0.5%, 5% & 60',
                            'Level 1: 1.5%, 10% & 30',
                            'If the position is at a gain of 0.65% (level 0), the amount will be decreased by 5% every 60 minutes. If the gain increases to 1.55% (level 1), the amount will be decreased by 10% every 30 minutes.',
                          ],
                        })
                      }
                      tabIndex={-1}
                    >
                      <CircleHelp
                        className="w-5 h-5"
                        aria-hidden="true"
                      />
                    </TooltipTrigger>
                    <TooltipContent side="left">
                      <p>More info</p>
                    </TooltipContent>
                  </Tooltip>
                </div>

                {GAIN_REQUIREMENTS.map((gainRequirement, i) => (
                  <div
                    key={i}
                    className="flex justify-start items-center gap-3 mt-7"
                  >
                    <h4 className={`font-semibold ${i === 0 ? 'mt-6' : ''}`}>#{i}</h4>

                    <FormField
                      control={form.control}
                      name={gainRequirement.name}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          {i === 0 && (
                            <FormDescription className="text-xs">
                              {breakpoint === 'xs' ? 'Gain req.%' : 'Gain requirement%'}
                            </FormDescription>
                          )}
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={gainRequirement.placeholder}
                              {...field}
                              autoComplete="off"
                              disabled={isSubmitting}
                              min={0.1}
                              max={MAX_GAIN_REQUIREMENT}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      rules={{
                        validate: {
                          required: (value) =>
                            isNumberValid(Number(value), 0.1, MAX_GAIN_REQUIREMENT)
                              ? true
                              : `Enter a number ranging 0.1 - ${MAX_GAIN_REQUIREMENT}`,
                        },
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={PERCENTAGES[i].name}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          {i === 0 && (
                            <FormDescription className="text-xs">Percentage</FormDescription>
                          )}
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={PERCENTAGES[i].placeholder}
                              {...field}
                              autoComplete="off"
                              disabled={isSubmitting}
                              min={1}
                              max={100}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      rules={{
                        validate: {
                          required: (value) =>
                            isNumberValid(Number(value), 1, 100)
                              ? true
                              : 'Enter a number ranging 1 - 100',
                        },
                      }}
                    />

                    <FormField
                      control={form.control}
                      name={FREQUENCIES[i].name}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          {i === 0 && (
                            <FormDescription className="text-xs">Frequency</FormDescription>
                          )}
                          <FormControl>
                            <Input
                              type="number"
                              placeholder={FREQUENCIES[i].placeholder}
                              {...field}
                              autoComplete="off"
                              disabled={isSubmitting}
                              min={1}
                              max={MAX_FREQUENCY}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                      rules={{
                        validate: {
                          required: (value) =>
                            isIntegerValid(Number(value), 3, MAX_FREQUENCY)
                              ? true
                              : `Enter an integer ranging 3 - ${MAX_FREQUENCY}`,
                        },
                      }}
                    />
                  </div>
                ))}
              </fieldset>
            </TabsContent>
          </Tabs>

          {/* ************
           * SUBMISSION *
           ************ */}
          <DialogFooter>
            <Button
              type="submit"
              disabled={isSubmitting || authority < 3}
              className="mt-7 w-full"
            >
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update
              configuration
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
          <DialogDescription className="flex justify-center items-center sm:justify-start">
            Connected to
            <img
              src={`/exchanges/color/${exchangeConfig.trading}.png`}
              alt={`Logo of the Exchange being used by the Strategy Module (${exchangeConfig.trading})`}
              height={435}
              width={90}
              className="ml-1 max-h-4"
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
