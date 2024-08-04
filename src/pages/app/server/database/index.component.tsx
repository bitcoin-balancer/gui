import { memo } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '../../../../shared/shadcn/components/ui/tabs.tsx';
import { DatabaseService, IDatabaseSummary } from '../../../../shared/backend/database/index.service.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';
import GeneralCard from './general-card.component.tsx';
import TablesCard from './tables-card.component.tsx';
import { IServerComponentProps } from '../types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Database Component
 * Component in charge of displaying the current database summary.
 */
const Database = memo(({ setSidenavOpen }: IServerComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest<IDatabaseSummary>(
    DatabaseService.getDatabaseSummary,
  );





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
    <div className='page-container flex justify-center items-start animate-in fade-in duration-700'>
      <section className='w-full lg:w-10/12 xl:w-8/12 2xl:w-7/12'>

        {/* HEADER */}
        <header className='flex justify-start items-center md:hidden mt-2 mb-5'>
          <Button variant='ghost' size='icon' className='mr-2' onClick={() => setSidenavOpen(true)}><Menu aria-hidden='true' /></Button>
          <h1 className='text-3xl font-bold'>Database</h1>
        </header>



        {/* CONTENT */}
        <Tabs defaultValue='general' className='w-full'>
          <TabsList className='grid w-full grid-cols-2'>
            <TabsTrigger value='general'>General</TabsTrigger>
            <TabsTrigger value='tables'>Tables</TabsTrigger>
          </TabsList>

          {/* GENERAL */}
          <TabsContent value='general'>
            <GeneralCard data={data} />
          </TabsContent>

          {/* TABLES */}
          <TabsContent value='tables'>
            <TablesCard data={data} />
          </TabsContent>
        </Tabs>

      </section>
    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Database;
