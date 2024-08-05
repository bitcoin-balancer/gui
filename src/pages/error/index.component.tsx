import { useRouteError } from 'react-router-dom';
import { extractMessage } from 'error-message-utils';
import { SWService } from 'sw-service';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Error Component
 * Component in charge of handling errors that can occur when loading routes.
 */
const Error = () => {
  const error = useRouteError();
  return (
    <main
      className='h-dvh bg-primary flex justify-center items-center text-white animate-in fade-in duration-700'
    >

      <section
        className='text-center p-5 w-full sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12'
      >

        <h1
          className='text-7xl mt-5'
        >Oops!</h1>

        <p
          className='mt-5'
        >{extractMessage(error)}</p>

        <Button
          size='lg'
          className='mt-5'
          onClick={SWService.updateApp}
        >Refresh app</Button>

      </section>

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Error;
