import { ColorService } from '@/shared/services/color/index.service.ts';
import { IMarker } from '@/shared/components/charts/shared/types.ts';
import { buildChartMarker } from '@/shared/components/charts/shared/utils.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds a marker object based on an action.
 * @param timestamp
 * @param isIncrease
 * @returns IMarker
 */
const buildMarker = (timestamp: number, isIncrease: boolean): IMarker =>
  buildChartMarker(
    timestamp,
    isIncrease ? 'belowBar' : 'aboveBar',
    isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
    isIncrease ? 'arrowUp' : 'arrowDown',
    isIncrease ? 'Buy' : 'Sell',
  );

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { buildMarker };
