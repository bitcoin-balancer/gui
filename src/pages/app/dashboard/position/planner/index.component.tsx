import { memo } from 'react';
import { ArrowDownWideNarrow, ArrowUpWideNarrow, AudioWaveform, Brain, PencilRuler, WandSparkles, GoalIcon, Split, TrendingUpDown } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { IComponentProps } from '@/pages/app/dashboard/position/planner/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Planner
 * Component in charge of ...
 */
const Planner = memo(({ windowState, positionState, className }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  // ...





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  const displayIncreasePlan = (): void => {

  };

  const displayDecreasePlan = (): void => {

  };



  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        aria-label='Position planner'
        className={className}
      >
        {/* <Split className='w-5 h-5 rotate-90' aria-hidden='true' /> */}
        <TrendingUpDown className='w-5 h-5' aria-hidden='true' />
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem
          onClick={displayIncreasePlan}
        >
          <ArrowUpWideNarrow
              aria-hidden='true'
              className='mr-1 h-5 w-5'
            /> Increase plan
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={displayDecreasePlan}
          disabled={positionState.plan.decrease === undefined}
        >
          <ArrowDownWideNarrow
              aria-hidden='true'
              className='mr-1 h-5 w-5'
            /> Decrease plan
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Planner;
