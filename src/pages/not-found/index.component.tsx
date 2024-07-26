import { Link } from 'react-router-dom';
import { Button } from '../../shared/shadcn/components/ui/button';
import { NavService } from '../../shared/services/nav/index.service';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Not Found Component
 * Component in charge of handling errors when users try to access routes that don't exist.
 */
const NotFound = () => (
  <main className='h-dvh bg-primary flex justify-center items-center text-white animate-in fade-in duration-700'>

    <section className='text-center p-5 w-full sm:w-7/12 md:w-5/12 lg:w-4/12 xl:w-3/12'>

      <h1 className="text-7xl mt-5">Oops!</h1>
      <p className='mt-5'>We can't seem to find the page you're looking for</p>

      <Link to={NavService.landing()}>
        <Button size='lg' className='mt-5 bg-primary hover:bg-secondary'>Go back</Button>
      </Link>

    </section>

  </main>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotFound;
