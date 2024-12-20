import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wallet } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Alert, AlertDescription, AlertTitle } from '@/shared/shadcn/components/ui/alert.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { formatDate, formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { IIncreasePlan } from '@/shared/backend/position/planner/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IPriceLineOptions } from '@/shared/components/charts/shared/types.ts';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import { IIncreasePlanComponentProps } from '@/pages/app/dashboard/position/planner/types.ts';


/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds te price line object that will be rendered in the chart.
 * @param canIncreaseAtPrice
 * @param isOpen
 * @returns IPriceLineOptions[]
 */
const buildPriceLines = (plan: IIncreasePlan): IPriceLineOptions[] => {
  if (plan.canIncrease && plan.canIncreaseAtPrice) {
    return [{
      id: 'open_increase_line',
      price: plan.canIncreaseAtPrice,
      color: ColorService.DECREASE_2,
    }];
  }
  return [];
};

/**
 * Builds the badge element that contains the canIncreaseAtPrice as well as the %.
 * @param plan
 * @param canIncreaseAtPrice
 * @returns JSX.Element | undefined
 */
const buildPriceBadge = (
  plan: IIncreasePlan,
  canIncreaseAtPrice: string | undefined,
): JSX.Element | undefined => (
  plan.canIncrease && plan.canIncreaseAtPrice && plan.canIncreaseAtPriceChange
    ? <Badge variant='secondary'>
      {canIncreaseAtPrice} <span className='ml-2 text-decrease-1'>{plan.canIncreaseAtPriceChange}%</span>
    </Badge>
    : undefined
);

/**
 * Builds the badge element that contains the formatted canIncreaseAtTime.
 * @param plan
 * @param canIncreaseAtTime
 * @returns JSX.Element | undefined
 */
const buildDateBadge = (
  plan: IIncreasePlan,
  canIncreaseAtTime: string | undefined,
): JSX.Element | undefined => (
  plan.canIncrease && plan.canIncreaseAtTime
    ? <Badge variant='secondary'>{canIncreaseAtTime}</Badge>
    : undefined
);





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Increase Plan Dialog Component
 * Component in charge of displaying the plan to open/increase a position.
 */
const IncreasePlanDialog = ({
  windowState,
  plan,
  closeDialog,
}: IIncreasePlanComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const navigate = useNavigate();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the price formatter that will be used on the chart
  const priceFormatter = useCallback((value: number) => formatDollarAmount(value, 0), []);

  // the list of split items for the current window
  const windowData = toSplitStateItems(windowState.window);

  // the date at which a position can be increased
  const canIncreaseAtTime = (
    plan.canIncrease && plan.canIncreaseAtTime
      ? formatDate(plan.canIncreaseAtTime, 'datetime-short')
      : undefined
  );

  // the price at which the position can be opened/increased
  const canIncreaseAtPrice = (
    plan.canIncrease && plan.canIncreaseAtPrice
      ? formatDollarAmount(plan.canIncreaseAtPrice, 0)
      : undefined
  );

  // the amount that will be used to open/increase a position
  const increaseAmountQuote = (
    plan.canIncrease ? formatDollarAmount(plan.increaseAmountQuote) : undefined
  );

  // the balance gap
  const missingQuoteAmount = (
    plan.canIncrease ? formatDollarAmount(plan.missingQuoteAmount) : undefined
  );

  // the price lines
  const priceLines = buildPriceLines(plan);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Closes the dialog and navigates to the adjustments page.
   */
  const navigateToAdjustments = async () => {
    await handleCloseDialog();
    navigate(NavService.adjustments());
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let planDescription: JSX.Element = (
    <div>
      The position won't be opened or increased because <strong>"Auto-increase"</strong> is
       currently disabled. In order to enable it, navigate to
        the <Button variant='link' onClick={navigateToAdjustments} className='p-0 m-0 h-auto text-base text-sky-700'>Adjustments</Button> page and
         update it via the <strong>"Strategy Form"</strong>
    </div>
  );

  // calculate the plan description if the position can be increased
  if (plan.canIncrease) {
    // init helpers
    const dateBadge: JSX.Element | undefined = buildDateBadge(plan, canIncreaseAtTime);
    const priceBadge: JSX.Element | undefined = buildPriceBadge(plan, canIncreaseAtPrice);
    const increaseAmountQuoteBadge: JSX.Element = <Badge variant='secondary'>{increaseAmountQuote}</Badge>;

    // put together the description according to the current requirements
    if (plan.canIncreaseAtTime) {
      if (plan.canIncreaseAtPrice && plan.canIncreaseAtPriceChange) {
        planDescription = (
          <div>
            The position will be increased by {increaseAmountQuoteBadge} if the price drops to
             {priceBadge} after {dateBadge} and a reversal event is issued
          </div>
        );
      } else {
        planDescription = (
          <div>
            The position will be increased by {increaseAmountQuoteBadge} after {dateBadge} and a
             reversal event is issued
          </div>
        );
      }
    } else if (plan.canIncreaseAtPrice && plan.canIncreaseAtPriceChange) {
      planDescription = (
        <div>
          A {increaseAmountQuoteBadge} position will be opened if the price drops to {priceBadge}
           and a reversal event is issued
        </div>
      );
    } else {
      planDescription = plan.isOpen
        ? <div>
          A {increaseAmountQuoteBadge} position will be opened if a reversal event is issued
        </div>
        : <div>
          The position will be increased by {increaseAmountQuoteBadge} if a reversal event is issued
        </div>;
    }
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className='p-0'>

        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Increase plan</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {
          (plan.canIncrease && plan.missingQuoteAmount > 0)
          && (
            <div className='px-6 pb-2'>
              <Alert>
                <Wallet className='h-4 w-4' />
                <AlertTitle>Insufficient balance!</AlertTitle>
                <AlertDescription>
                  Please deposit <Badge variant='secondary'>{missingQuoteAmount}</Badge> to your Spot
                  Wallet so positions can be opened/increased.
                </AlertDescription>
              </Alert>
            </div>
          )
        }

        <div
          className='text-light px-6 -mt-3 text-center sm:text-left'
        >
          {planDescription}
        </div>

        <LineChart
          kind='line'
          height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
          data={windowData}
          priceLines={priceLines}
          priceFormatterFunc={priceFormatter}
          showAttributionLogo={false}
        />

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default IncreasePlanDialog;
