import { UTCTimestamp, ChartOptions, DeepPartial } from 'lightweight-charts';
import { ISplitStateItem, IState } from '@/shared/backend/market-state/index.service.ts';
import { formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IChartKind, ISeriesItem } from '@/shared/components/charts/line-chart/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Converts a list of split state items into series items, ready to be rendered.
 * @param items
 * @returns ISeriesItem[]
 */
const toSeriesItems = (items: ISplitStateItem[]): ISeriesItem[] => items.map(
  (value) => ({
    time: value.x / 1000 as UTCTimestamp,
    value: value.y,
  }),
);

/**
 * Builds the essential options for creating a line chart.
 * @param chartContainerEl
 * @param height
 * @param prettifyY
 * @returns DeepPartial<ChartOptions>
 */
const buildChartOptions = (
  chartContainerEl: HTMLDivElement,
  height: number,
  prettifyY: boolean | undefined,
): DeepPartial<ChartOptions> => ({
  layout: {
    textColor: 'black',
    attributionLogo: true,
  },
  width: chartContainerEl.clientWidth,
  height,
  grid: { horzLines: { visible: false }, vertLines: { visible: false } },
  localization: {
    priceFormatter: prettifyY ? (val: number) => formatDollarAmount(val, 0) : undefined,
  },
  timeScale: {
    borderColor: ColorService.PRIMARY,
    timeVisible: true,
  },
  rightPriceScale: {
    borderColor: ColorService.PRIMARY,
  },
  crosshair: {
    // change mode from default 'magnet' to 'normal'.
    // allows the crosshair to move freely without snapping to datapoints
    mode: 0,

    // Vertical crosshair line (showing Date in Label)
    vertLine: {
      width: 1,
      color: ColorService.PRIMARY,
      style: 3,
      labelBackgroundColor: ColorService.PRIMARY,
    },

    // Horizontal crosshair line (showing Price in Label)
    horzLine: {
      color: ColorService.PRIMARY,
      labelBackgroundColor: ColorService.PRIMARY,
    },
  },
});

/**
 * Determines the up and down color based on the current state of the market state module.
 * @param state
 * @returns { upColor: string, downColor: string }
 */
/* const getBarColorsByState = (state: IState | undefined): { upColor: string, downColor: string } => {
  if (state === 2) {
    return { upColor: ColorService.INCREASE_2, downColor: ColorService.INCREASE_0 };
  }
  if (state === -2) {
    return { upColor: ColorService.DECREASE_2, downColor: ColorService.DECREASE_0 };
  }
  return { upColor: ColorService.INCREASE_1, downColor: ColorService.DECREASE_1 };
}; */





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toSeriesItems,
  buildChartOptions,
  /* getBarColorsByState, */
};
