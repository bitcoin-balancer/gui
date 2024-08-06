import { useEffect, useRef } from 'react';
import { createChart, type IChartApi } from 'lightweight-charts';
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
            color: '#0C0C0c',
            style: 3,
            labelBackgroundColor: '#0C0C0c',
          },

          // Horizontal crosshair line (showing Price in Label)
          horzLine: {
            color: '#0C0C0C',
            labelBackgroundColor: '#0C0C0C',
          },
        },
      },
    );

    const handleResize = () => {
      chartAPI.current!.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const candlestickSeries = chartAPI.current.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
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
