import { useState } from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Transactions
 * Component in charge of displaying the transactions that took place in a position.
 */
const Transactions = ({ position, setSidenavOpen }: IPositionComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */



  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [active, setActive] = useState();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
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
          >Transactions</h1>
        </header>


      </section>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Transactions;
