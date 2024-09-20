import { useState } from 'react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { IPositionAction } from '@/shared/backend/position/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Action Component
 * Component in charge of displaying an increase/decrease action.
 */
const PositionAction = ({ action }: { action: IPositionAction }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [active, setActive] = useState();


  console.log('PositionAction');





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <article>
      <div
        className='flex justify-start items-center'
      >
        <p
          className='text-light text-sm'
        >TX ID</p>
        <span className='flex-1'></span>
        <Button
          variant='outline'
        >
          {action.txID}
        </Button>
      </div>

      <div
        className='flex justify-start items-center mt-5'
      >
        <p
          className='text-light text-sm'
        >Event</p>
        <span className='flex-1'></span>
        <p
          className='max-w-[50%] sm:max-width-[70%] truncate'
        >{formatDate(action.eventTime, 'datetime-medium')}</p>
      </div>

      <div
        className='flex justify-start items-center mt-5'
      >
        <p
          className='text-light text-sm'
        >Next event</p>
        <span className='flex-1'></span>
        <p
          className='max-w-[50%] sm:max-width-[70%] truncate'
        >{formatDate(action.nextEventTime, 'datetime-medium')}</p>
      </div>
    </article>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionAction;
