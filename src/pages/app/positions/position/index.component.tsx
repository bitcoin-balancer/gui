import { useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  ChartCandlestick,
  Gauge,
  List,
  ListChecks,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { PositionService, IPosition } from '@/shared/backend/position/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import General from '@/pages/app/positions/position/general/index.component';
import History from '@/pages/app/positions/position/history/index.component';
import Trades from '@/pages/app/positions/position/trades/index.component';
import Transactions from '@/pages/app/positions/position/transactions/index.component.tsx';
import { IPageName, INavItem } from '@/pages/app/positions/position/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of sections that can be navigated
const NAV_ITEMS: INavItem[] = [
  {
    id: 'general',
    name: 'General',
    icon: <Gauge aria-hidden='true' className='mr-2 w-5 h-5' />,
  },
  {
    id: 'history',
    name: 'History',
    icon: <ChartCandlestick aria-hidden='true' className='mr-2 w-5 h-5' />,
  },
  {
    id: 'trades',
    name: 'Trades',
    icon: <List aria-hidden='true' className='mr-2 w-5 h-5' />,
  },
  {
    id: 'transactions',
    name: 'Transactions',
    icon: <ListChecks aria-hidden='true' className='mr-2 w-5 h-5' />,
  },
];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Component
 * Component in charge of displaying all the information regarding a position record.
 */
const Position = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { id } = useParams();
  const { data, loading, error } = useAPIFetch<IPosition>(useMemo(
    () => ({ fetchFunc: { func: PositionService.getPosition, args: [id] } }),
    [id],
  ));
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<IPageName>('general');
  const breakpoint = useMediaQueryBreakpoint();
  const navigate = useNavigate();





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  // ...




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Closes the sidenav once it triggers the navigation.
   * @param name
   */
  const navigateFromSidenav = (name: IPageName): void => {
    setSidenavOpen(false);
    setActivePage(name);
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (error) {
    return <PageLoadError error={error} />;
  }
  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <section
        className='flex justify-center items-start animate-in fade-in duration-700'
      >

      {/* **********************
        * DESKTOP SIDENAV MENU *
        ********************** */}
        {
          (breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl')
          && <aside
            className='md:w-56 xl:w-64 pl-3 pt-3'
          >
            <header>
              <h1
                className='text-lg font-bold'
              >Position</h1>
            </header>

            <nav
              className='mt-3'
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => setActivePage(item.id)}
                  disabled={activePage === item.id}
                >
                  {item.icon} {item.name}
                </Button>
              ))}

              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigate(NavService.positions())}
                >
                  <ArrowLeft
                    aria-hidden='true'
                    className='mr-2 w-5 h-5'
                  /> Back to full list
              </Button>
            </nav>
          </aside>
        }

        <div className='flex-1 w-full'>
          {
            activePage === 'general'
            && <General
              position={data}
              setSidenavOpen={setSidenavOpen}
            />
          }
          {
            activePage === 'history'
            && <History
              position={data}
              setSidenavOpen={setSidenavOpen}
            />
          }
          {
            activePage === 'trades'
            && <Trades
              position={data}
              setSidenavOpen={setSidenavOpen}
            />
          }
          {
            activePage === 'transactions'
            && <Transactions
              position={data}
              setSidenavOpen={setSidenavOpen}
            />
          }
        </div>

      </section>



      {/* *********************
        * MOBILE SIDENAV MENU *
        ********************* */}
      {
        (breakpoint === 'xs' || breakpoint === 'sm' || breakpoint === 'md')
        && <Sheet
          open={sidenavOpen}
          onOpenChange={setSidenavOpen}
        >

          <SheetContent
            className='w-64 sm:72 md-80 lg:96 p-4'
            side='left'
          >

            <SheetHeader>
              <SheetTitle className='text-left'>Position</SheetTitle>
              <SheetDescription></SheetDescription>
            </SheetHeader>

            <nav
              className='mt-3'
            >
              {NAV_ITEMS.map((item) => (
                <Button
                  key={item.id}
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigateFromSidenav(item.id)}
                  disabled={activePage === item.id}
                >
                  {item.icon} {item.name}
                </Button>
              ))}

              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigate(NavService.positions())}
                >
                  <ArrowLeft
                    aria-hidden='true'
                    className='mr-2 w-5 h-5'
                  /> Back to full list
              </Button>
            </nav>

          </SheetContent>

        </Sheet>
      }

    </>

  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Position;
