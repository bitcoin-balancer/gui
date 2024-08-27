import { useCallback, useEffect, useState } from 'react';
import { prettifyValue } from 'bignumber-utils';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store';
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
  const marketState = useBoundStore((state) => state.marketState!);
  const [activeDialog, setActiveDialog] = useState<ISplitStatesDialogData | undefined>(undefined);





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
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Closes the window state dialog.
   */
  const closeWindowStateDialog = useCallback(
    (): void => {
      setActiveDialog(undefined);
    },
    [],
  );





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
            openSplitStatesDialog={setActiveDialog}
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

          {/* ************
            * INDICATORS *
            ************ */}
          <Indicators
            marketState={marketState}
          />

          <Separator className='my-10 md:hidden' />

          {/* *******
            * COINS *
            ******* */}
          <Coins
            coinsStates={marketState.coinsStates}
          />

        </aside>

      </div>





      {/* *********************
        * SPLIT STATES DIALOG *
        ********************* */}
      {
        activeDialog !== undefined
        && <SplitStatesDialog
          data={activeDialog}
          closeDialog={closeWindowStateDialog}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Dashboard;
