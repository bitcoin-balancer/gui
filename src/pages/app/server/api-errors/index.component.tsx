import { memo, useState, useMemo } from 'react';
import { Menu, Trash } from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '../../../../shared/shadcn/components/ui/card.tsx';
import { APIErrorService, IAPIError } from '../../../../shared/backend/api-error/index.service.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';
import { IServerComponentProps } from '../types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Errors Component
 * Component in charge of displaying the API Errors.
 */
const APIErrors = memo(({ setSidenavOpen }: IServerComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { data, loading, error } = useAPIRequest<IAPIError[]>(
    APIErrorService.list,
    useMemo(() => [LIMIT], []),
  );




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  const deleteAll = (): void => {

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
    <div className='page-container flex justify-center items-start animate-in fade-in duration-700'>
      <section className='w-full md:w-12/12 lg:w-12/12 xl:w-12/12 2xl:w-12/12'>

        {/* HEADER */}
        <header className='flex justify-start items-center mt-2 mb-5'>
          <Button variant='ghost' size='icon' className='mr-2 md:hidden' onClick={() => setSidenavOpen(true)} aria-label='Open Side Navigation'><Menu aria-hidden='true' /></Button>
          <h1 className='text-2xl md:text-3xl font-bold'>API Errors</h1>
          <span className='flex-1'></span>

          <Button onClick={deleteAll} disabled={isSubmitting} className='hidden sm:flex'>
            <Trash aria-hidden='true' /> Delete all
          </Button>
          <Button onClick={deleteAll} disabled={isSubmitting} className='sm:hidden' size='icon' aria-label='Delete all of the API Errors'>
            <Trash aria-hidden='true' />
          </Button>
        </header>



        {/* CONTENT */}
        <Card>
          <CardContent>

          </CardContent>
        </Card>

      </section>
    </div>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrors;
