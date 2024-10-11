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
 * @param time
 * @param count
 * @param isIncrease
 * @returns IMarker
 */
const __buildMarker = (
  time: number,
  count: number,
  isIncrease: boolean,
): IMarker => buildChartMarker(
  time,
  isIncrease ? 'belowBar' : 'aboveBar',
  isIncrease ? ColorService.INCREASE_1 : ColorService.DECREASE_1,
  isIncrease ? 'arrowUp' : 'arrowDown',
  __generateMarkerText(count, isIncrease),
);

/**
 * Builds a list of markers for a type of action based on the candlestick open times for optimal
 * accuracy.
 * @param openTimes
 * @param actions
 * @param isIncrease
 * @returns IMarker[]
 */
const __buildActionMarkers = (
  openTimes: number[],
  actions: IPositionAction[],
  isIncrease: boolean,
): IMarker[] => {
  // init values
  const markers: Record<string, number> = {};

  // iterate over each action and find the candlestick bar it belongs to
  actions.forEach((action) => {
    openTimes.forEach((time, i) => {
      if (i === openTimes.length - 1) {
        if (action.eventTime >= time) {
          markers[time] = typeof markers[time] === 'number' ? markers[time] + 1 : 1;
        }
      } else if (action.eventTime >= time && action.eventTime < openTimes[i + 1]) {
        markers[time] = typeof markers[time] === 'number' ? markers[time] + 1 : 1;
      }
    });
  });

  // turn the record into a list
  return Object.entries(markers).map(
    ([time, count]) => __buildMarker(Number(time), count, isIncrease),
  );
};

/**
 * Builds the increase and decrease markers for a position.
 * @param candlestickOpenTimes
 * @param increaseActions
 * @param decreaseActions
 * @returns IMarker[]
 */
const buildPositionMarkers = (
  candlestickOpenTimes: number[],
  increaseActions: IPositionAction[],
  decreaseActions: IDecreaseActions,
): IMarker[] => {
  if (!candlestickOpenTimes.length) {
    return [];
  }
  return [
    ...__buildActionMarkers(candlestickOpenTimes, increaseActions, true),
    ...__buildActionMarkers(candlestickOpenTimes, decreaseActions.flat(), false),
  ].sort(sortRecords('time', 'asc'));
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  buildPositionMarkers,
};
