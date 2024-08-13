import { useState, useEffect } from 'react';
import { sendGET } from 'fetch-request-browser';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import ChartComponent from '@/pages/app/dashboard/chart.component.tsx';
import { ICandlestick } from '@/pages/app/dashboard/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dashboard Component
 * Component in charge of displaying and managing the market state and trading strategy.
 */
const Dashboard = () => {
  const [candlesticks, setCandlesticks] = useState<ICandlestick[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let ignore = false;

    const getCandlesticks = async () => {
      const { data } = await sendGET('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=128');
      if (!ignore) {
        setCandlesticks(data.map((candlestick: number[]) => ({
          open: Number(candlestick[1]),
          high: Number(candlestick[2]),
          low: Number(candlestick[3]),
          close: Number(candlestick[4]),
          time: candlestick[0] / 1000,
        })));
        setLoading(false);
      }
    };

    getCandlesticks();

    const intervalID = setInterval(() => {
      getCandlesticks();
    }, 2000);

    return () => {
      ignore = true;
      clearInterval(intervalID);
    };
  }, []);

  if (loading) {
    return <PageLoader />;
  }
  return (
    <div
      className='page-container flex flex-col sm:flex-row justify-center items-start gap-5 animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-8/12 xl:w-8/12 2xl:w-9/12'
      >
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartComponent data={candlesticks} />
          </CardContent>
        </Card>
      </section>

      <aside
        className='flex-1'
      >
        <Card>
          <CardHeader>
            <CardTitle>Card Title</CardTitle>
            <CardDescription>Card Description</CardDescription>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </aside>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Dashboard;
