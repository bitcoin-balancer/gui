import { memo, useMemo } from 'react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { ISplitStateID } from '@/shared/backend/market-state/shared/types.ts';
import { MarketStateService } from '@/shared/backend/market-state/index.service.ts';
import { formatPercentageChange } from '@/shared/services/transformers/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { ISplitTileButtonProps } from '@/pages/app/dashboard/window/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Retrieves the optimal side for the tooltip to show up in order to avoid interruptions.
 * @param id
 * @returns 'top' | 'bottom'
 */
const getTooltipSide = (id: ISplitStateID): 'top' | 'bottom' =>
  id === 's100' || id === 's75' || id === 's50' || id === 's25' ? 'top' : 'bottom';

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

  // the side in which the tooltip will appear to avoid interruptions
  const tooltipSide = getTooltipSide(id);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Tooltip>
      <TooltipTrigger
        onClick={() => displayWindowDialog(id)}
        className={`text-white text-xs sm:text-sm py-2 px-0 sm:px-2 font-semibold ${ColorService.STATE_BG_CLASS_NAME[split.state]} hover:opacity-80`}
      >
        {splitChange}
      </TooltipTrigger>
      <TooltipContent side={tooltipSide}>
        <p>{MarketStateService.SPLIT_NAMES[id]} of the dataset</p>
      </TooltipContent>
    </Tooltip>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SplitTileButton;
