import { SWService } from 'sw-service';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Error Component
 * Component in charge of handling errors that can occur when loading routes.
 */
const Error = () => (
  <main className='h-dvh bg-primary flex justify-center items-center text-white animate-in fade-in duration-700'>

    <section className='text-center p-5 w-full sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12'>

      <h1 className="text-7xl mt-5">Oops!</h1>
      <p className='mt-5'>There was an error while processing your request. Please refresh the app and try again</p>
      <Button size='lg' className='mt-5' onClick={SWService.updateApp}>Refresh app</Button>

    </section>

  </main>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Error;
