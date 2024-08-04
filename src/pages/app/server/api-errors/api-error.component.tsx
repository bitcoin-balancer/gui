import { useMemo } from 'react';
import { decodeError } from 'error-message-utils';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../../../shared/shadcn/components/ui/badge.tsx';
import { IAPIErrorProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Component
 * Component in charge of displaying all the information regarding an error.
 */
const APIError = ({ id, data, setActiveDialog }: IAPIErrorProps) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // decoded error
  const { message, code } = useMemo(() => decodeError(data.error), [data]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Button
      id={id}
      variant='ghost'
      className='w-full justify-left items-center text-left h-auto py-5 px-3 text-wrap' aria-label='Display API Error'
      onClick={() => setActiveDialog(data)}>

      <div>
        <p className='font-bold max-w-44 sm:max-w-96 xl:max-w-[500px] truncate'>{data.origin}</p>
        <p className='text-light text-sm'>{message}</p>
      </div>

      <span className='flex-1'></span>

      <Badge variant='destructive' className='max-w-20'><p className='truncate'>{code}</p></Badge>

    </Button>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIError;
