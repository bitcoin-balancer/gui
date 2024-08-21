import { useRef, useLayoutEffect, useEffect } from 'react';
import { createChart, UTCTimestamp, IChartApi } from 'lightweight-charts';
import {
  toSeriesItems,
  buildChartOptions,
  /* getBarColorsByState, */
} from '@/shared/components/charts/line-chart/utils.ts';
import {
  IComponentProps,
  IChartAPIRef,
  ILineSeriesAPI,
} from '@/shared/components/charts/line-chart/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Line Chart Component
 * Component in charge of rendering a Candlesticks Chart.
 */
const LineChart = ({
  kind = 'line',
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
    series(): ILineSeriesAPI {
      if (!this.__series) {
        // const { upColor, downColor } = getBarColorsByState(state);
        if (kind === 'line') {
          this.__series = this.api().addLineSeries({ color: '#2962FF' });
        } else {
          this.__series = this.api().addAreaSeries({
            lineColor: '#2962FF',
            topColor: '#2962FF',
            bottomColor: 'rgba(41, 98, 255, 0.28)',
          });
        }
      }
      return this.__series;
    },

    // applies the data changes to the chart
    onSeriesChanges(newData): void {
      const series = this.series();
      const seriesData = this.series().data();
      if (!seriesData.length) {
        // init the bars
        series.setData(toSeriesItems(newData));
      } else if (
        seriesData[seriesData.length - 1].time !== newData[newData.length - 1].x / 1000
      ) {
        // update the most recent item
        series.update({
          time: newData[newData.length - 2].x / 1000 as UTCTimestamp,
          value: newData[newData.length - 2].y,
        });

        // add the new item
        series.update({
          time: newData[newData.length - 1].x / 1000 as UTCTimestamp,
          value: newData[newData.length - 1].y,
        });
      } else {
        // update current item
        series.update({
          time: newData[newData.length - 1].x / 1000 as UTCTimestamp,
          value: newData[newData.length - 1].y,
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
    // const { upColor, downColor } = getBarColorsByState(state);
    chartAPIRef.current.series().applyOptions({ color: '#2962FF' });
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
export default LineChart;
