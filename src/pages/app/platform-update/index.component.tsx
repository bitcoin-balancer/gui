import { useBoundStore } from '@/shared/store/index.store.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Platform Update Component
 * Component in charge of ...
 */
const PlatformUpdate = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const version = useBoundStore((state) => state.version!);


  return (
    <div
      className='page-container flex justify-center items-start animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-9/12 xl:w-7/12 2xl:w-6/12'
      >

        <h1 className="text-2xl md:text-3xl">Platform Update</h1>


      </section>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PlatformUpdate;
