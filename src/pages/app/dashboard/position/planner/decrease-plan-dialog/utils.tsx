import { formatDistance } from 'date-fns';
import { calculatePercentageChange } from 'bignumber-utils';
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
      color: lvl.idleUntil === null ? ColorService.INCREASE_1 : ColorService.INCREASE_0,
      title: lvl.idleUntil === null ? '' : `Active in ${formatDistance(lvl.idleUntil, serverTime)}`,
    }));
  }
  return [];
};

/**
 * Calculates the absolute % difference between 2 values.
 * @param valueA
 * @param valueB
 * @returns number
 */
const __calculateAbsolutePercentageDifference = (valueA: number, valueB: number): number => (
  Math.abs(calculatePercentageChange(valueA, valueB))
);

/**
 * Checks if the planner is targeting a decrease level.
 * @param targetPrice
 * @param levelPrice
 * @param maxPercentageDifference
 * @returns boolean
 */
const __isTargetingDecreaseLevel = (
  targetPrice: number,
  levelPrice: number,
  maxPercentageDifference: number,
): boolean => (
  __calculateAbsolutePercentageDifference(targetPrice, levelPrice) < maxPercentageDifference
);

/**
 * Checks if the plan is targeting the decrease levels or the window state. Returns undefined if
 * targeting the decrease levels.
 * @param plan
 * @returns IPriceLineOptions | undefined
 */
const buildWindowStatePriceLine = (
  plan: IDecreasePlan,
  maxPercentageDifference: number = 0.1,
): IPriceLineOptions | undefined => {
  if (plan.canDecrease && plan.canDecreaseAtPrice) {
    if (plan.decreaseLevels.filter((level) => (
      __isTargetingDecreaseLevel(plan.canDecreaseAtPrice!, level.price, maxPercentageDifference)
    )).length === 0) {
      return {
        id: 'window-state',
        price: plan.canDecreaseAtPrice,
        color: ColorService.INCREASE_2,
      };
    }
  }
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
