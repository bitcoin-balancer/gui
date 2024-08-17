import { useRef, useLayoutEffect, useEffect } from 'react';
import { createChart, UTCTimestamp, type IChartApi } from 'lightweight-charts';
import { toBars, buildChartOptions, getBarColorsByState } from '@/shared/components/charts/candlesticks/utils.ts';
import {
  IComponentProps,
  IChartAPIRef,
  ICandlestickBar,
  ICandlestickSeriesAPI,
} from '@/shared/components/charts/candlesticks/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Candlesticks Component
 * Component in charge of rendering a Candlesticks Chart.
 */
const Candlesticks = ({ height, data, state }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const chartContainerRef = useRef<HTMLDivElement | null>(null);
  const chartAPIRef = useRef<IChartAPIRef>({
    // properties
    __api: undefined,
    __series: undefined,

    // init (only once) and return the instance of the Chart API
    api(): IChartApi {
      if (!this.__api) {
        this.__api = createChart(
          chartContainerRef.current!,
          buildChartOptions(chartContainerRef.current!, height),
        );
        this.__api.timeScale().fitContent();
      }
      return this.__api;
    },

    // init (only once) and apply the data changes to the chart
    onSeriesChanges(newData): void {
      // init the series if it hasn't been
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

      // init / update the data
      const seriesData = this.__series.data();
      if (!seriesData.length) {
        this.__series.setData(toBars(newData));
      } else if (
        seriesData[seriesData.length - 1].time !== newData.id[newData.id.length - 1] / 1000
      ) {
        // update the most recent bar
        this.__series.update({
          time: newData.id[newData.id.length - 2] / 1000 as UTCTimestamp,
          open: newData.open[newData.id.length - 2],
          high: newData.high[newData.id.length - 2],
          low: newData.low[newData.id.length - 2],
          close: newData.close[newData.id.length - 2],
        });

        // add the new bar
        this.__series.update({
          time: newData.id[newData.id.length - 1] / 1000 as UTCTimestamp,
          open: newData.open[newData.id.length - 1],
          high: newData.high[newData.id.length - 1],
          low: newData.low[newData.id.length - 1],
          close: newData.close[newData.id.length - 1],
        });
      } else {
        this.__series.update({
          time: newData.id[newData.id.length - 1] / 1000 as UTCTimestamp,
          open: newData.open[newData.id.length - 1],
          high: newData.high[newData.id.length - 1],
          low: newData.low[newData.id.length - 1],
          close: newData.close[newData.id.length - 1],
        });
      }
    },
  });
  /* const chartAPI = useRef<IChartApi | null>(null); */




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
   * Fires whenever the data changes, keeping the local state synced.
   */
  useEffect(() => {
    chartAPIRef.current.onSeriesChanges(data);
  }, [data]);



  /* useEffect(() => {
    chartAPI.current = createChart(
      chartContainerRef.current!,
      buildChartOptions(chartContainerRef.current!, height),
    );


    const { upColor, downColor } = getBarColorsByState(state);
    const candlestickSeries = chartAPI.current.addCandlestickSeries({
      upColor, // trading view:'#26a69a'
      downColor, // trading view:'#ef5350'
      borderVisible: false,
      wickUpColor: upColor, // trading view:'#26a69a'
      wickDownColor: downColor, // trading view:'#ef5350'
    });

    const candlesticks = toBars(data);


    candlestickSeries.setData(candlesticks);

    chartAPI.current.timeScale().fitContent();

    // resize management
    const handleResize = () => {
      chartAPI.current!.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };
    window.addEventListener('resize', handleResize);



    // clean up
    return () => {
      window.removeEventListener('resize', handleResize);
      chartAPI.current!.remove();
    };
  }, [height, data, state]); */





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return <div ref={chartContainerRef} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Candlesticks;
