import { toLocalTime } from '@/shared/services/transformers/index.service.ts';
import { sortRecords } from '@/shared/services/utils/index.service.ts';
import { IPositionAction, IDecreaseActions } from '@/shared/backend/position/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IMarker } from '@/shared/components/charts/candlestick-chart/index.component.tsx';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Builds a marker object based on an action.
 * @param action
 * @param isIncrease
 * @returns IMarker
 */
const __buildMarker = (action: IPositionAction, isIncrease: boolean): IMarker => ({
  time: toLocalTime(action.eventTime),
  position: isIncrease ? 'belowBar' : 'aboveBar',
  color: isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
  shape: isIncrease ? 'arrowUp' : 'arrowDown',
  text: isIncrease ? 'Increase' : 'Decrease',
});

/**
 * Builds the markers for the increase actions
 * @param actions
 * @returns IMarker[]
 */
const __buildIncreaseMarkers = (actions: IPositionAction[]): IMarker[] => actions.map(
  (action) => __buildMarker(action, true),
);

/**
 * Builds the markers for the decrease actions.
 * @param decreaseActions
 * @returns IMarker[]
 */
const __buildDecreaseMarkers = (actions: IDecreaseActions): IMarker[] => actions.flat().map(
  (action) => __buildMarker(action, false),
);

/**
 * Builds the markers for all the actions that have taken place.
 * @param increaseActions
 * @param decreaseActions
 * @returns IMarker[]
 */
const buildPositionMarkers = (
  increaseActions: IPositionAction[],
  decreaseActions: IDecreaseActions,
): IMarker[] => [
  ...__buildIncreaseMarkers(increaseActions),
  ...__buildDecreaseMarkers(decreaseActions),
].sort(sortRecords('time', 'asc'));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildPositionMarkers,
};
