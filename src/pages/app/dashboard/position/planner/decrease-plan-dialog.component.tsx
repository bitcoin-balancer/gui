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
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
} from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import {
  buildDateBadge,
  buildDecreaseLevelPriceLines,
  buildPriceBadge,
  buildWindowStatePriceLine,
} from '@/pages/app/dashboard/position/planner/utils.tsx';
import { IDecreasePlanComponentProps } from '@/pages/app/dashboard/position/planner/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Decrease Plan Dialog Component
 * Component in charge of displaying the plan to decrease a position.
 */
const DecreasePlanDialog = ({
  windowState,
  plan,
  closeDialog,
}: IDecreasePlanComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const serverTime = useBoundStore((state) => state.serverTime!);
  const navigate = useNavigate();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the price formatter that will be used on the chart
  const priceFormatter = useCallback((value: number) => formatDollarAmount(value, 0), []);

  // the list of split items for the current window
  const windowData = toSplitStateItems(windowState.window);

  // the date at which a position can be decreased
  const canDecreaseAtTime = (
    plan.canDecrease && plan.canDecreaseAtTime
      ? formatDate(plan.canDecreaseAtTime, 'datetime-short')
      : undefined
  );

  // the price at which the position can be decreased
  const canDecreaseAtPrice = (
    plan.canDecrease && plan.canDecreaseAtPrice
      ? formatDollarAmount(plan.canDecreaseAtPrice, 0)
      : undefined
  );

  // the balance gap
  const missingBaseAmount = (
    plan.canDecrease ? formatBitcoinAmount(plan.missingBaseAmount) : undefined
  );

  // the price lines
  const decreaseLevelPriceLines = buildDecreaseLevelPriceLines(plan, serverTime);
  const windowStatePriceLine = buildWindowStatePriceLine(plan);




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
      The position won't be decreased because <strong>"Auto-decrease"</strong> is currently
       disabled. In order to enable it, navigate to
        the <Button variant='link' onClick={navigateToAdjustments} className='p-0 m-0 h-auto text-base text-sky-700'>Adjustments</Button> page and
         update it via the <strong>"Strategy Form"</strong>
    </div>
  );

  // calculate the plan description if the position can be decreased
  if (plan.canDecrease) {
    // init helpers
    const dateBadge: JSX.Element | undefined = buildDateBadge(plan, canDecreaseAtTime);
    const priceBadge: JSX.Element | undefined = buildPriceBadge(plan, canDecreaseAtPrice);
    const decreasePercentageBadge: JSX.Element = <Badge variant='secondary'>{plan.decreasePercentage}%</Badge>;

    // put together the description according to the current requirements
    if (plan.canDecreaseAtTime) {
      if (plan.canDecreaseAtPrice && plan.canDecreaseAtPriceChange) {
        planDescription = (
          <div>
            The position will be decreased by {decreasePercentageBadge} if the price rises to
             {priceBadge} after {dateBadge}
          </div>
        );
      } else {
        planDescription = (
          <div>
            The position will be decreased by {decreasePercentageBadge} after {dateBadge}
          </div>
        );
      }
    } else if (plan.canDecreaseAtPrice && plan.canDecreaseAtPriceChange) {
      planDescription = (
        <div>
          The position will be decreased by {decreasePercentageBadge} if the price rises to
           {priceBadge}
        </div>
      );
    } else {
      planDescription = (
        <div>
          The position will be decreased by {decreasePercentageBadge}
        </div>
      );
    }
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className='p-0'>

        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Decrease plan</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>

        {
          (plan.canDecrease && plan.missingBaseAmount > 0)
          && (
            <div className='px-6 pb-2'>
              <Alert>
                <Wallet className='h-4 w-4' />
                <AlertTitle>Insufficient balance!</AlertTitle>
                <AlertDescription>
                  Please deposit <Badge variant='secondary'>{missingBaseAmount}</Badge> to your Spot
                  Wallet so positions can be decreased.
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
          priceLines={
            windowStatePriceLine === undefined
              ? decreaseLevelPriceLines
              : [...decreaseLevelPriceLines, windowStatePriceLine]
          }
          priceFormatterFunc={priceFormatter}
        />

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default DecreasePlanDialog;
