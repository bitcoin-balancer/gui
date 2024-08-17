import { useEffect, useRef } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { toBars, buildChartOptions } from '@/shared/components/charts/candlesticks/utils.ts';
import { IComponentProps } from '@/shared/components/charts/candlesticks/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Candlesticks Component
 * Component in charge of rendering a Candlesticks Chart.
 */
const Candlesticks = ({ height, data }: IComponentProps) => {
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



    const candlestickSeries = chartAPI.current.addCandlestickSeries({
      upColor: ColorService.INCREASE_1, // trading view:'#26a69a'
      downColor: ColorService.DECREASE_1, // trading view:'#ef5350'
      borderVisible: false,
      wickUpColor: ColorService.INCREASE_1, // trading view:'#26a69a'
      wickDownColor: ColorService.DECREASE_1, // trading view:'#ef5350'
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
  }, [height, data]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return <div ref={chartContainerRef} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Candlesticks;
