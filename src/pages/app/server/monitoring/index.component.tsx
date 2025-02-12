import { memo, useMemo } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { ServerService } from '@/shared/backend/server/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { IServerComponentProps } from '@/pages/app/server/types.ts';
import APICard from '@/pages/app/server/monitoring/api-card.component.tsx';
import MemoryCard from '@/pages/app/server/monitoring/memory-card.component.tsx';
import CPUCard from '@/pages/app/server/monitoring/cpu-card.component.tsx';
import FileSystemCard from '@/pages/app/server/monitoring/file-system-card.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Monitoring Component
 * Component in charge of displaying the current state of the server.
 */
const Monitoring = memo(({ setSidenavOpen }: IServerComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => ServerService.getState(),
      refetchFrequency: 35,
    }),
    [],
  ));





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
    <div
      className='page-container flex justify-center items-start animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-10/12 xl:w-8/12 2xl:w-7/12'
      >

        {/* ********
          * HEADER *
          ******** */}
        <header
          className='flex justify-start items-center md:hidden mb-5'
        >
          <Button
            variant='ghost'
            size='icon'
            className='mr-2'
            onClick={() => setSidenavOpen(true)}
            aria-label='Open Side Navigation'
          ><Menu aria-hidden='true' /></Button>
          <h1
            className='text-2xl font-semibold leading-none tracking-tight'
          >Monitoring</h1>
        </header>



        {/* ***********
          * FIRST ROW *
          *********** */}
        <div
          className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15'
        >

          {/* API CARD */}
          <APICard data={data} />

          <Separator className='my-7 md:hidden' />

          {/* MEMORY CARD */}
          <MemoryCard data={data.memory} />

        </div>


        {/* ************
          * SECOND ROW *
          ************ */}
        <div
          className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15 mt-5 lg:mt-10 2xl:mt-15'
        >

          <Separator className='my-7 md:hidden' />

          {/* CPU CARD */}
          <CPUCard data={data.cpu} />

          <Separator className='my-7 md:hidden' />

          {/* FILESYSTEM CARD */}
          <FileSystemCard data={data.fileSystem} />

        </div>

      </section>

    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Monitoring;
