import { useRef, useLayoutEffect, useEffect } from 'react';
import { createChart, UTCTimestamp, IChartApi } from 'lightweight-charts';
import { toLocalTime } from '@/shared/services/transformers/index.service.ts';
import {
  toBars,
  buildChartOptions,
  getBarColorsByState,
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
  prettifyY,
}: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
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
          buildChartOptions(chartContainerRef.current!, height, prettifyY),
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
        });
      }
      return this.__series;
    },

    // applies the data changes to the chart
    onSeriesChanges(newData): void {
      const series = this.series();
      const seriesData = this.series().data();
      if (!seriesData.length) {
        // init the bars
        series.setData(toBars(newData));
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
  useEffect(() => { chartAPIRef.current.onSeriesChanges(data); }, [data]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return <div ref={chartContainerRef} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CandlestickChart;
