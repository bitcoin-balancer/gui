import { useState } from 'react';
import { ChartNoAxesColumn, Bug, Database as DatabaseIcon } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../../shared/shadcn/components/ui/badge.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '../../../shared/shadcn/components/ui/sheet.tsx';
import { useMediaQueryBreakpoint } from '../../../shared/hooks/media-query-breakpoint/index.hook.ts';
import Monitoring from './monitoring/index.component.tsx';
import APIErrors from './api-errors/index.component.tsx';
import Database from './database/index.component.tsx';
import { IPageName } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Server Component
 * Component in charge of allowing the user to browse through the sub-components.
 */
const Server = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<IPageName>('monitoring');
  const breakpoint = useMediaQueryBreakpoint();





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
  return (
    <>
      <section className='flex justify-center items-start animate-in fade-in duration-700'>

        {
          (breakpoint === 'md' || breakpoint === 'lg' || breakpoint === 'xl' || breakpoint === '2xl')
          && <aside className='md:w-56 xl:w-64 pl-3 pt-3'>
            <header>
              <h1 className='text-lg font-bold'>Server</h1>
            </header>

            <nav className='mt-3'>
              <Button variant='ghost' className='w-full justify-start' onClick={() => setActivePage('monitoring')} disabled={activePage === 'monitoring'}>
                  <ChartNoAxesColumn aria-hidden='true' className='mr-2' /> Monitoring
                </Button>
              <Button variant='ghost' className='w-full justify-start' onClick={() => setActivePage('api-errors')} disabled={activePage === 'api-errors'}>
                <Bug aria-hidden='true' className='mr-2' /> API Errors
                <span className='flex-1'></span>
                <Badge variant='destructive'>99+</Badge>
              </Button>
              <Button variant='ghost' className='w-full justify-start' onClick={() => setActivePage('database')} disabled={activePage === 'database'}>
                <DatabaseIcon aria-hidden='true' className='mr-2' /> Database
              </Button>
            </nav>
          </aside>
        }

        <div className='flex-1'>
          {activePage === 'monitoring' && <Monitoring setSidenavOpen={setSidenavOpen} />}
          {activePage === 'api-errors' && <APIErrors setSidenavOpen={setSidenavOpen} />}
          {activePage === 'database' && <Database setSidenavOpen={setSidenavOpen} />}
        </div>

      </section>

      {/* SIDENAV MENU */}
      {
        (breakpoint === 'xs' || breakpoint === 'sm')
        && <Sheet open={sidenavOpen} onOpenChange={setSidenavOpen}>

          <SheetContent className='w-64 sm:72 md-80 lg:96 p-4' side='left'>

            <SheetHeader>
              <SheetTitle>Server</SheetTitle>
              <SheetDescription>Components that comprise the API</SheetDescription>
            </SheetHeader>

            <nav className='mt-3'>
              <Button variant='ghost' className='w-full justify-start' onClick={() => navigateFromSidenav('monitoring')} disabled={activePage === 'monitoring'}>
                  <ChartNoAxesColumn aria-hidden='true' className='mr-2' /> Monitoring
                </Button>
              <Button variant='ghost' className='w-full justify-start' onClick={() => navigateFromSidenav('api-errors')} disabled={activePage === 'api-errors'}>
                <Bug aria-hidden='true' className='mr-2' /> API Errors
                <span className='flex-1'></span>
                <Badge variant='destructive'>99+</Badge>
              </Button>
              <Button variant='ghost' className='w-full justify-start' onClick={() => navigateFromSidenav('database')} disabled={activePage === 'database'}>
                <DatabaseIcon aria-hidden='true' className='mr-2' /> Database
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
export default Server;
