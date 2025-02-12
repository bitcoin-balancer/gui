import { useCallback, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Archive,
  ArchiveX,
  ArrowLeft,
  ChartCandlestick,
  Gauge,
  List,
  ListChecks,
  Loader2,
  ReceiptText,
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
import { toast } from '@/shared/shadcn/components/ui/use-toast.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import General from '@/pages/app/positions/position/general/index.component.tsx';
import History from '@/pages/app/positions/position/history/index.component.tsx';
import Trades from '@/pages/app/positions/position/trades/index.component.tsx';
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
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => PositionService.getPosition(id as string),
    }),
    [id],
  ));
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<IPageName>('general');
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const breakpoint = useMediaQueryBreakpoint();
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const { authority } = useBoundStore((state) => state.user!);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const navigate = useNavigate();





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

  /**
   * Refetches the position record and updates the state.
   * @returns Promise<void>
   */
  const refetchPosition = useCallback(
    async () => {
      try {
        setData(await PositionService.getPosition(data.id));
      } catch (e) {
        errorToast(e);
      }
    },
    [data, setData],
  );

  /**
   * Prompts the user with the confirmation dialog and archives the active position.
   */
  const archive = () => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Archive',
      description: `The position ${data.id} will be archived immediately upon submission and won't be taken into consideration when calculating metrics`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await PositionService.archivePosition(data.id, confirmation);
          setData({ ...data, archived: true });
          toast({
            title: 'Success',
            description: 'The position has been archived and will not be taken into consideration when calculating metrics.',
          });
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /**
   * Prompts the user with the confirmation dialog and unarchives the active position.
   */
  const unarchive = () => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Unarchive',
      description: `The position ${data.id} will be unarchived immediately upon submission and will be taken into consideration when calculating metrics`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await PositionService.unarchivePosition(data.id, confirmation);
          setData({ ...data, archived: true });
          toast({
            title: 'Success',
            description: 'The position has been unarchived and will be taken into consideration when calculating metrics.',
          });
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
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
                  disabled={activePage === item.id || isSubmitting}
                >
                  {item.icon} {item.name}
                </Button>
              ))}

              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => openPositionDialog(data)}
                  disabled={isSubmitting}
                >
                  <ReceiptText
                    aria-hidden='true'
                    className='mr-2 w-5 h-5'
                  /> Display details
              </Button>

              <Separator className='my-3' />
              {
                data.archived
                  ? <Button
                      variant='ghost'
                      className='w-full justify-start'
                      onClick={unarchive}
                      disabled={isSubmitting || authority < 4}
                    >
                      <ArchiveX
                        aria-hidden='true'
                        className='mr-2 w-5 h-5'
                      /> Unarchive position

                      <span className='flex-1'></span>

                      {isSubmitting && <Loader2 className='w-4 h-4 animate-spin'/>}
                  </Button>
                  : <Button
                      variant='ghost'
                      className='w-full justify-start'
                      onClick={archive}
                      disabled={isSubmitting || authority < 4}
                    >
                      <Archive
                        aria-hidden='true'
                        className='mr-2 w-5 h-5'
                      /> Archive position

                      <span className='flex-1'></span>

                      {isSubmitting && <Loader2 className='w-4 h-4 animate-spin'/>}
                  </Button>
              }


              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigate(NavService.positions())}
                  disabled={isSubmitting}
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
              refetchPosition={refetchPosition}
            />
          }
          {
            activePage === 'history'
            && <History
              position={data}
              setSidenavOpen={setSidenavOpen}
              refetchPosition={refetchPosition}
            />
          }
          {
            activePage === 'trades'
            && <Trades
              position={data}
              setSidenavOpen={setSidenavOpen}
              refetchPosition={refetchPosition}
            />
          }
          {
            activePage === 'transactions'
            && <Transactions
              position={data}
              setSidenavOpen={setSidenavOpen}
              refetchPosition={refetchPosition}
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
                  disabled={activePage === item.id || isSubmitting}
                >
                  {item.icon} {item.name}
                </Button>
              ))}

              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => openPositionDialog(data)}
                  disabled={isSubmitting}
                >
                  <ReceiptText
                    aria-hidden='true'
                    className='mr-2 w-5 h-5'
                  /> Display details
              </Button>

              <Separator className='my-3' />
              <Button
                  variant='ghost'
                  className='w-full justify-start'
                  onClick={() => navigate(NavService.positions())}
                  disabled={isSubmitting}
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
