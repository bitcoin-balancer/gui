import { Loader2 } from 'lucide-react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Global Loader Component
 * Component in charge of giving the user feedback when a component is loading.
 */
const GlobalLoader = () => (
  <div
    className='h-dvh bg-primary flex justify-center items-center'
  >

    <Loader2
      className='mr-2 h-14 w-14 animate-spin text-white'
    />

  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default GlobalLoader;
