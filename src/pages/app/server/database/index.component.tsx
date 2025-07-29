import { memo, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/shadcn/components/ui/tabs.tsx';
import { DatabaseService } from '@/shared/backend/database/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { IServerComponentProps } from '@/pages/app/server/types.ts';
import GeneralCard from '@/pages/app/server/database/general-card.component.tsx';
import TablesCard from '@/pages/app/server/database/tables-card.component.tsx';

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
  const { data, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => DatabaseService.getDatabaseSummary(),
      }),
      [],
    ),
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
    <div className="page-container flex justify-center items-start animate-in fade-in duration-700">
      <section className="w-full md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12">
        {/* ********
         * HEADER *
         ******** */}
        <header className="flex justify-start items-center md:hidden mb-5">
          <Button
            variant="ghost"
            size="icon"
            className="mr-2"
            onClick={() => setSidenavOpen(true)}
            aria-label="Open Side Navigation"
          >
            <Menu aria-hidden="true" />
          </Button>
          <h1 className="text-2xl font-semibold leading-none tracking-tight">Database</h1>
        </header>

        {/* *********
         * CONTENT *
         ********* */}
        <Tabs
          defaultValue="general"
          className="w-full"
        >
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="tables">Tables</TabsTrigger>
          </TabsList>

          {/* *********
           * GENERAL *
           ********* */}
          <TabsContent value="general">
            <GeneralCard data={data} />
          </TabsContent>

          {/* ********
           * TABLES *
           ******** */}
          <TabsContent value="tables">
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
