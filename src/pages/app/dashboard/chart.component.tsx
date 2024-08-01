import { createChart } from 'lightweight-charts';
import { useEffect, useRef } from 'react';
import { ICandlestick } from './type';

const ChartComponent = ({ data }: { data: ICandlestick[] }) => {
  const chartContainerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const chart = createChart(
      chartContainerRef.current!,
      {
        layout: {
          textColor: 'black',
        },
        width: chartContainerRef.current!.clientWidth,
        height: 300,
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
      chart.applyOptions({ width: chartContainerRef.current!.clientWidth });
    };

    const candlestickSeries = chart.addCandlestickSeries({
      upColor: '#26a69a',
      downColor: '#ef5350',
      borderVisible: false,
      wickUpColor: '#26a69a',
      wickDownColor: '#ef5350',
    });

    candlestickSeries.setData(data);

    chart.timeScale().fitContent();

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      chart.remove();
    };
  }, [data]);

  return <div ref={chartContainerRef} />;
};



export default ChartComponent;
