import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { IIncreasePlan } from '@/shared/backend/position/planner/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IPriceLineOptions } from '@/shared/components/charts/shared/types.ts';

/* ************************************************************************************************
 *                                          PRICE LINES                                           *
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





/* ************************************************************************************************
 *                                             BADGES                                             *
 ************************************************************************************************ */

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
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // price lines
  buildPriceLines,

  // badges
  buildPriceBadge,
  buildDateBadge,
};
