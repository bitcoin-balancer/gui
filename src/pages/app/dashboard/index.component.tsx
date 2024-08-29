import { useEffect, useState } from 'react';
import { prettifyValue } from 'bignumber-utils';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import SplitStatesDialog, {
  ISplitStatesDialogData,
} from '@/pages/app/dashboard/split-states-dialog/index.component.tsx';
import WindowState from '@/pages/app/dashboard/window/index.component.tsx';
import Position from '@/pages/app/dashboard/position/index.component.tsx';
import Indicators from '@/pages/app/dashboard/indicators/index.component.tsx';
import Coins from '@/pages/app/dashboard/coins/index.component.tsx';

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
  const breakpoint = useMediaQueryBreakpoint();
  const marketState = useBoundStore((state) => state.marketState!);
  const [splitStatesDialog, setSplitStatesDialog] = useState<ISplitStatesDialogData>();





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
    <>
      <div
        className='dashboard-container page-container flex flex-col lg:flex-row justify-center items-start gap-5 animate-in fade-in duration-700'
      >

        <section
          className='window w-full lg:w-8/12 xl:w-8/12 2xl:w-9/12'
        >
          {/* **************
            * WINDOW STATE *
            ************** */}
          <WindowState
            windowState={marketState.windowState}
            openSplitStatesDialog={setSplitStatesDialog}
          />
        </section>

        <aside
          className='flex-1 w-full'
        >

          <Separator className='my-10 md:hidden' />

          {/* **********
            * POSITION *
            ********** */}
          <Position />

          <Separator className='my-10 md:hidden' />

          {/* ******
            * TABS *
            ****** */}
          {
            (breakpoint !== 'xs' && breakpoint !== 'sm')
            && <Tabs
              defaultValue='indicators'
              className='w-full md:mt-7'
            >
              <TabsList
                className='grid w-full grid-cols-2'
              >
                <TabsTrigger value='indicators'>Indicators</TabsTrigger>
                <TabsTrigger value='coins'>Coins</TabsTrigger>
              </TabsList>

              <TabsContent value='indicators'>
                <Indicators
                  marketState={marketState}
                  openSplitStatesDialog={setSplitStatesDialog}
                />
              </TabsContent>

              <TabsContent value='coins'>
                <Coins
                  coinsStates={marketState.coinsStates}
                  openSplitStatesDialog={setSplitStatesDialog}
                />
              </TabsContent>
            </Tabs>
          }

          {/* *******
            * CARDS *
            ******* */}
          {
            (breakpoint === 'xs' || breakpoint === 'sm')
            && <>
              <Indicators
                  marketState={marketState}
                  openSplitStatesDialog={setSplitStatesDialog}
                />

              <Separator className='my-10 md:hidden' />

              <Coins
                coinsStates={marketState.coinsStates}
                openSplitStatesDialog={setSplitStatesDialog}
              />
            </>
          }
        </aside>

      </div>





      {/* *********************
        * SPLIT STATES DIALOG *
        ********************* */}
      {
        splitStatesDialog !== undefined
        && <SplitStatesDialog
          data={splitStatesDialog}
          closeDialog={setSplitStatesDialog}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Dashboard;
