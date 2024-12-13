import { useMemo, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { formatDate, formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { IIncreasePlan } from '@/shared/backend/position/planner/index.service.ts';
import LineChart from '@/shared/components/charts/line-chart/index.component.tsx';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IIncreasePlanComponentProps } from '@/pages/app/dashboard/position/planner/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */


const calculatePlanDescription = (plan: IIncreasePlan): JSX.Element => {


};




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





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the price formatter that will be used on the chart
  const priceFormatter = useCallback((value: number) => formatDollarAmount(value, 0), []);

  // the list of split items for the current window
  const windowData = useMemo(() => toSplitStateItems(windowState.window), [windowState.window]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent className='p-0'>

        <DialogHeader className='p-6 pb-0'>
          <DialogTitle>Increase plan</DialogTitle>
          <DialogDescription>
            Events broadcasted by the Balancer API
          </DialogDescription>
        </DialogHeader>

        <LineChart
          kind='line'
          height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 450}
          data={windowData}
          priceFormatterFunc={priceFormatter}
        />

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default IncreasePlanDialog;
