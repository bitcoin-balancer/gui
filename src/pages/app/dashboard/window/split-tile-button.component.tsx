import { memo, useMemo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
import { formatPercentageChange } from '@/shared/services/transformations/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { ISplitTileButtonProps } from '@/pages/app/dashboard/window/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Split Tile Button Component
 * Component in charge of displaying a grid tile button for the splits.
 */
const SplitTileButton = memo(({ id, split, displayWindowDialog }: ISplitTileButtonProps) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the change% experienced by the split
  const splitChange = useMemo(() => formatPercentageChange(split.change, 1), [split.change]);

  // determines the background class that will be applied on the button based on the state
  const bgClass = useMemo(() => ColorService.getBackgroundClassByState(split.state), [split.state]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => displayWindowDialog(id)}
        className={`text-white text-xs sm:text-sm py-2 px-0 sm:px-2 font-semibold ${bgClass} hover:opacity-80`}
      >
        {splitChange}
      </TooltipTrigger>
      <TooltipContent><p>{MarketStateService.SPLIT_NAMES[id]} of the dataset</p></TooltipContent>
    </Tooltip>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SplitTileButton;
