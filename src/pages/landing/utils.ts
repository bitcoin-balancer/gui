import { toLocalTime } from '@/shared/services/transformers/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IMarker } from '@/shared/components/charts/candlestick-chart/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds a marker object based on an action.
 * @param timestamp
 * @param isIncrease
 * @returns IMarker
 */
const buildMarker = (timestamp: number, isIncrease: boolean): IMarker => ({
  time: toLocalTime(timestamp),
  position: isIncrease ? 'belowBar' : 'aboveBar',
  color: isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
  shape: isIncrease ? 'arrowUp' : 'arrowDown',
  text: isIncrease ? 'Buy' : 'Sell',
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildMarker,
};
