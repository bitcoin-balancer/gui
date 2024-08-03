import { useState } from 'react';
import { ChartNoAxesColumn, Bug, Database as DatabaseIcon } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../../shared/shadcn/components/ui/badge.tsx';
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
  const [activePage, setActivePage] = useState<IPageName>('monitoring');
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
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
        {activePage === 'monitoring' && <Monitoring />}
        {activePage === 'api-errors' && <APIErrors />}
        {activePage === 'database' && <Database />}
      </div>

    </section>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Server;
