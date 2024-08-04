import { memo } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { ServerService, IServerState } from '../../../../shared/backend/server/index.service.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';
import APICard from './api-card.component.tsx';
import MemoryCard from './memory-card.component.tsx';
import CPUCard from './cpu-card.component.tsx';
import FileSystemCard from './file-system-card.component.tsx';
import { IServerComponentProps } from '../types.ts';

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
  const { data, loading, error } = useAPIRequest<IServerState>(ServerService.getState);





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
          <h1 className='text-3xl font-bold'>Server</h1>
        </header>



        {/* FIRST ROW */}
        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15'>

          {/* API CARD */}
          <APICard data={data} />

          {/* MEMORY CARD */}
          <MemoryCard data={data.memory} />

        </div>



        {/* SECOND ROW */}
        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15 mt-5 lg:mt-10 2xl:mt-15'>

          {/* CPU CARD */}
          <CPUCard data={data.cpu} />

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
