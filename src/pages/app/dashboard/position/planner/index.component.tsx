import { memo, useState } from 'react';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, TrendingUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { IComponentProps } from '@/pages/app/dashboard/position/planner/types.ts';
import IncreasePlanDialog from '@/pages/app/dashboard/position/planner/increase-plan-dialog.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Planner
 * Component in charge of handling the menu for the plans.
 */
const Planner = memo(({ windowState, positionState, className }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isIncreasePlanOpen, setIsIncreasePlanOpen] = useState<boolean>();
  const [isDecreasePlanOpen, setIsDecreasePlanOpen] = useState<boolean>();




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ******
        * MENU *
        ****** */}
      <DropdownMenu>
        <DropdownMenuTrigger
          aria-label='Position planner'
          className={className}
        >
          <TrendingUpDown className='w-5 h-5' aria-hidden='true' />
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          <DropdownMenuItem
            onClick={() => setIsIncreasePlanOpen(true)}
          >
            <ArrowUpWideNarrow
                aria-hidden='true'
                className='mr-1 h-5 w-5'
              /> Increase plan
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => setIsDecreasePlanOpen(true)}
            disabled={positionState.plan.decrease === undefined}
          >
            <ArrowDownWideNarrow
                aria-hidden='true'
                className='mr-1 h-5 w-5'
              /> Decrease plan
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>



      {/* **********************
        * INCREASE PLAN DIALOG *
        ********************** */}
      {
        isIncreasePlanOpen
        && <IncreasePlanDialog
          windowState={windowState}
          plan={positionState.plan.increase}
          closeDialog={setIsIncreasePlanOpen}
        />
      }



      {/* **********************
        * DECREASE PLAN DIALOG *
        ********************** */}
      {
        isDecreasePlanOpen
        && <IncreasePlanDialog
          windowState={windowState}
          plan={positionState.plan.increase}
          closeDialog={setIsIncreasePlanOpen}
        />
      }
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Planner;
