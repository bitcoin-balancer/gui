import { useEffect, useRef } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';
import { toBars, buildChartOptions, getBarColorsByState } from '@/shared/components/charts/candlesticks/utils.ts';
import { IComponentProps } from '@/shared/components/charts/candlesticks/types.ts';

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
  const chartAPI = useRef<IChartApi | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);




  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */



  useEffect(() => {
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
  }, [height, data, state]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return <div ref={chartContainerRef} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Candlesticks;
