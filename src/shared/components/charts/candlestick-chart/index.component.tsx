import { useRef, useLayoutEffect, useEffect } from 'react';
import { createChart, IChartApi } from 'lightweight-charts';
import { isArrayValid } from 'web-utils-kit';
import { toLocalTime } from '@/shared/components/charts/shared/utils.ts';
import {
  toBars,
  buildChartOptions,
  getBarColorsByState,
  shouldChartBeRefreshed,
} from '@/shared/components/charts/candlestick-chart/utils.ts';
import {
  IComponentProps,
  IChartAPIRef,
  ICandlestickSeriesAPI,
} from '@/shared/components/charts/candlestick-chart/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Candlestick Chart Component
 * Component in charge of rendering a Candlesticks Chart.
 */
const CandlestickChart = ({
  height,
  data,
  state,
  markers,
  priceFormatterFunc,
  showAttributionLogo = true,
  hideTimeScale = false,
  hideRightPriceScale = false,
  hideCrosshair = false,
  hidePriceLine = false,
  disableScrollHandler = false,
  disableScaleHandler = false,
  refreshFrequency,
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const lastRefreshRef = useRef<number>();
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartAPIRef = useRef<IChartAPIRef>({
    // properties
    __api: undefined,
    __series: undefined,

    // inits (only once) and returns the instance of the Chart API
    api(): IChartApi {
      if (!this.__api) {
        this.__api = createChart(
          chartContainerRef.current!,
          buildChartOptions(
            chartContainerRef.current!,
            height,
            priceFormatterFunc,
            showAttributionLogo,
            hideTimeScale,
            hideRightPriceScale,
            hideCrosshair,
            disableScrollHandler,
            disableScaleHandler,
          ),
        );
        this.__api.timeScale().fitContent();
      }
      return this.__api;
    },

    // inits (only once) and returns the instance of the Series API
    series(): ICandlestickSeriesAPI {
      if (!this.__series) {
        const { upColor, downColor } = getBarColorsByState(state);
        this.__series = this.api().addCandlestickSeries({
          upColor,
          downColor,
          borderVisible: false,
          wickUpColor: upColor,
          wickDownColor: downColor,
          priceLineVisible: !hidePriceLine,
        });
        if (isArrayValid(markers)) {
          this.__series.setMarkers(markers);
        }
      }
      return this.__series;
    },

    // applies the data changes to the chart
    onSeriesChanges(newData): void {
      const series = this.series();
      const seriesData = this.series().data();
      if (!seriesData.length || shouldChartBeRefreshed(refreshFrequency, lastRefreshRef.current)) {
        // init/refresh the bars
        series.setData(toBars(newData));
        if (typeof refreshFrequency === 'number') {
          lastRefreshRef.current = Date.now();
        }
      } else if (
        seriesData[seriesData.length - 1].time !== toLocalTime(newData.id[newData.id.length - 1])
      ) {
        // update the most recent bar
        series.update({
          time: toLocalTime(newData.id[newData.id.length - 2]),
          open: newData.open[newData.id.length - 2],
          high: newData.high[newData.id.length - 2],
          low: newData.low[newData.id.length - 2],
          close: newData.close[newData.id.length - 2],
        });

        // add the new bar
        series.update({
          time: toLocalTime(newData.id[newData.id.length - 1]),
          open: newData.open[newData.id.length - 1],
          high: newData.high[newData.id.length - 1],
          low: newData.low[newData.id.length - 1],
          close: newData.close[newData.id.length - 1],
        });
      } else {
        // update current bar
        series.update({
          time: toLocalTime(newData.id[newData.id.length - 1]),
          open: newData.open[newData.id.length - 1],
          high: newData.high[newData.id.length - 1],
          low: newData.low[newData.id.length - 1],
          close: newData.close[newData.id.length - 1],
        });
      }
    },
  });

  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Fires whenever the document's window is resized. It ensures the chart's width matches the
   * available space.
   */
  useLayoutEffect(() => {
    const handleResize = () => {
      chartAPIRef.current.api().applyOptions({
        width: chartContainerRef.current!.clientWidth,
        height,
      });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [height]);

  /**
   * Fires whenever the state changes and set the appropriate bar colors.
   */
  useEffect(() => {
    const { upColor, downColor } = getBarColorsByState(state);
    chartAPIRef.current.series().applyOptions({
      upColor,
      downColor,
      wickUpColor: upColor,
      wickDownColor: downColor,
    });
  }, [state]);

  /**
   * Fires whenever the data changes, keeping the local state synced.
   */
  useEffect(() => {
    chartAPIRef.current.onSeriesChanges(data);
  }, [data]);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return <div ref={chartContainerRef} />;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CandlestickChart;
