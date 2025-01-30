import { formatDistance } from 'date-fns';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { IDecreasePlan } from '@/shared/backend/position/planner/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IPriceLineOptions } from '@/shared/components/charts/shared/types.ts';

/* ************************************************************************************************
 *                                          PRICE LINES                                           *
 ************************************************************************************************ */

/**
 * Builds te price line object that will be rendered in the chart.
 * @param plan
 * @param serverTime
 * @returns IDecreaseLevelPriceLines
 */
const buildDecreaseLevelPriceLines = (
  plan: IDecreasePlan,
  serverTime: number,
): IPriceLineOptions[] => {
  if (plan.canDecrease) {
    return plan.decreaseLevels.map((lvl, idx) => ({
      id: `lvl-${idx}`,
      price: lvl.price,
      color: lvl.idleUntil === null ? ColorService.INCREASE_2 : ColorService.INCREASE_0,
      title: lvl.idleUntil === null ? '' : `Active in ${formatDistance(lvl.idleUntil, serverTime)}`,
    }));
  }
  return [];
};

const buildWindowStatePriceLine = (plan: IDecreasePlan): IPriceLineOptions | undefined => {
  return undefined;
};





/* ************************************************************************************************
 *                                             BADGES                                             *
 ************************************************************************************************ */

/**
 * Builds the badge element that contains the canDecreaseAtPrice as well as the %.
 * @param plan
 * @param canDecreaseAtPrice
 * @returns JSX.Element | undefined
 */
const buildPriceBadge = (
  plan: IDecreasePlan,
  canDecreaseAtPrice: string | undefined,
): JSX.Element | undefined => (
  plan.canDecrease && plan.canDecreaseAtPrice && plan.canDecreaseAtPriceChange
    ? <Badge variant='secondary'>
      {canDecreaseAtPrice} <span className='ml-2 text-increase-1'>+{plan.canDecreaseAtPriceChange}%</span>
    </Badge>
    : undefined
);

/**
 * Builds the badge element that contains the formatted canDecreaseAtTime.
 * @param plan
 * @param canDecreaseAtTime
 * @returns JSX.Element | undefined
 */
const buildDateBadge = (
  plan: IDecreasePlan,
  canDecreaseAtTime: string | undefined,
): JSX.Element | undefined => (
  plan.canDecrease && plan.canDecreaseAtTime
    ? <Badge variant='secondary'>{canDecreaseAtTime}</Badge>
    : undefined
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // price lines
  buildDecreaseLevelPriceLines,
  buildWindowStatePriceLine,

  // badges
  buildPriceBadge,
  buildDateBadge,
};
