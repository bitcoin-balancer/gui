import { useEffect } from 'react';
import { prettifyValue } from 'bignumber-utils';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import WindowState from '@/pages/app/dashboard/window/index.component.tsx';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the string that will be shown in Balancer's tab (title bar).
 * @param price
 * @param change
 * @returns string
 */
const buildDocumentTitle = (price: number, change: number): string => `
  ${prettifyValue(price, { processing: { decimalPlaces: 0 }, format: { prefix: '$' } })}
  ${change > 0 ? '+' : ''}${prettifyValue(change, { processing: { decimalPlaces: 1 }, format: { suffix: '%' } })}
`;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dashboard Component
 * Component in charge of displaying and managing the market state and trading strategy.
 */
const Dashboard = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const marketState = useBoundStore((state) => state.marketState!);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Sets the Bitcoin's price and price change% as the document's title.
   */
  useEffect(() => {
    if (marketState) {
      document.title = buildDocumentTitle(
        marketState.windowState.window.close[marketState.windowState.window.close.length - 1],
        marketState.windowState.splitStates.s100.change,
      );
    }
    return () => {
      document.title = 'Balancer';
    };
  }, [marketState]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (marketState === undefined) {
    return <PageLoader />;
  }
  return (
    <div
      className='page-container flex flex-col lg:flex-row justify-center items-start gap-5 animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-8/12 xl:w-8/12 2xl:w-9/12'
      >
        {/* **************
          * WINDOW STATE *
          ************** */}
        <WindowState
          windowState={marketState.windowState}
        />
      </section>

      <aside
        className='flex-1 w-full'
      >

        <Separator className='my-10 md:hidden' />

        {/* **********
          * POSITION *
          ********** */}
        <Card className='md:mt-2.5 lg:mt-0'>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Separator className='my-10 md:hidden' />

        {/* ************
          * INDICATORS *
          ************ */}
        <Card className='md:mt-7'>
          <CardHeader>
            <CardTitle>Indicators</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>

        <Separator className='my-10 md:hidden' />

        {/* *******
          * COINS *
          ******* */}
        <Card className='md:mt-7'>
          <CardHeader>
            <CardTitle>Coins</CardTitle>
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
