import { sortRecords } from '@/shared/services/utils/index.service.ts';
import { IPositionAction, IDecreaseActions } from '@/shared/backend/position/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IMarker } from '@/shared/components/charts/shared/types.ts';
import { buildChartMarker } from '@/shared/components/charts/shared/utils.ts';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Generates the text that will be attached to the marker.
 * @param actionsCount
 * @param isIncrease
 * @returns string
 */
const __generateMarkerText = (actionsCount: number, isIncrease: boolean): string => {
  if (actionsCount > 1) {
    return `${isIncrease ? 'Increase' : 'Decrease'} x${actionsCount}`;
  }
  return isIncrease ? 'Increase' : 'Decrease';
};

/**
 * Builds a marker object based on an action.
 * @param action
 * @param count
 * @param isIncrease
 * @returns IMarker
 */
const __buildMarker = (
  action: IPositionAction,
  count: number,
  isIncrease: boolean,
): IMarker => buildChartMarker(
  action.eventTime,
  isIncrease ? 'belowBar' : 'aboveBar',
  isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
  isIncrease ? 'arrowUp' : 'arrowDown',
  __generateMarkerText(count, isIncrease),
);

/**
 * Builds the markers for the increase actions
 * @param actions
 * @returns IMarker[]
 */
const __buildIncreaseMarkers = (actions: IPositionAction[]): IMarker[] => actions.map(
  (action) => __buildMarker(action, 0, true),
);

/**
 * Builds the markers for the decrease actions.
 * @param decreaseActions
 * @returns IMarker[]
 */
const __buildDecreaseMarkers = (actions: IDecreaseActions): IMarker[] => actions.flat().map(
  (action) => __buildMarker(action, 0, false),
);

/**
 * Builds the markers for all the actions that have taken place.
 * @param candlestickIDs
 * @param increaseActions
 * @param decreaseActions
 * @returns IMarker[]
 */
const buildPositionMarkers = (
  candlestickIDs: number[],
  increaseActions: IPositionAction[],
  decreaseActions: IDecreaseActions,
): IMarker[] => [
  ...__buildIncreaseMarkers(increaseActions),
  ...__buildDecreaseMarkers(decreaseActions),
].sort(sortRecords('time', 'asc'));



/* const buildPositionMarkers = (
  candlestickIDs: number[],
  increaseActions: IPositionAction[],
  decreaseActions: IDecreaseActions,
): IMarker[] => {
  if (!candlestickIDs.length) {
    return [];
  }

  // init values
  const markers: Record<string, number> = {};
}; */




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildPositionMarkers,
};
