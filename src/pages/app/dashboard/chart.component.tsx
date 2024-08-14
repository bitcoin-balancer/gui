import { useEffect, useRef } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { ICandlestick } from '@/pages/app/dashboard/types.ts';

const ChartComponent = ({ data }: { data: ICandlestick[] }) => {
  const chartAPI = useRef<IChartApi | null>(null);
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chartAPI.current = createChart(
      chartContainerRef.current!,
      {
        layout: {
          textColor: 'black',
          attributionLogo: true,
        },
        width: chartContainerRef.current!.clientWidth,
        height: 600,
        grid: { horzLines: { visible: false }, vertLines: { visible: false } },
        crosshair: {
          // Change mode from default 'magnet' to 'normal'.
          // Allows the crosshair to move freely without snapping to datapoints
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
      },
    );

    const handleResize = () => {
      chartAPI.current!.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const candlestickSeries = chartAPI.current.addCandlestickSeries({
      upColor: ColorService.INCREASE_1, // trading view:'#26a69a'
      downColor: ColorService.DECREASE_1, // trading view:'#ef5350'
      borderVisible: false,
      wickUpColor: ColorService.INCREASE_1, // trading view:'#26a69a'
      wickDownColor: ColorService.DECREASE_1, // trading view:'#ef5350'
    });

    // @ts-ignore
    candlestickSeries.setData(data);

    chartAPI.current.timeScale().fitContent();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chartAPI.current!.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
};



export default ChartComponent;
