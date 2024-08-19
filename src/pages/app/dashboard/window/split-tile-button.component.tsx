import { memo, useMemo } from 'react';
import { processValue } from 'bignumber-utils';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
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
  const splitChange = useMemo(
    () => `${split.change > 0 ? '+' : ''}${processValue(split.change, { decimalPlaces: 1 })}%`,
    [split.change],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => displayWindowDialog(id)}
        className={`text-white text-xs sm:text-sm py-2 px-0 sm:px-2 ${ColorService.getBackgroundClassByState(split.state)} hover:opacity-80`}
      >
        {splitChange}
      </TooltipTrigger>
      <TooltipContent><p>Split: {MarketStateService.SPLIT_NAMES[id]}</p></TooltipContent>
    </Tooltip>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SplitTileButton;
