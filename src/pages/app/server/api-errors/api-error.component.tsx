import { useMemo, memo } from 'react';
import { decodeError } from 'error-message-utils';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { IAPIErrorProps } from '@/pages/app/server/api-errors/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Component
 * Component in charge of displaying all the information regarding an error.
 */
const APIError = memo(({ id, data, openDialog }: IAPIErrorProps) => {
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
      className='w-full justify-left items-center text-left h-auto py-5 px-3 text-wrap'
      aria-label='Display API Error'
      onClick={openDialog}
    >

      <div>
        <Badge
          variant='secondary'
          className='max-w-44 sm:max-w-96 xl:max-w-[500px]'
        >
          <p className='truncate text-sm'>{data.origin}</p>
        </Badge>
        <p
          className='text-light text-sm mt-1 break-all'
        >{message}</p>
        <p
          className='text-light text-xs font-normal hidden sm:block mt-1'
        >{formatDate(data.event_time, 'datetime-long')}</p>
        <p
          className='text-light text-xs font-normal sm:hidden mt-1'
        >{formatDate(data.event_time, 'datetime-medium')}</p>
      </div>

      <span className='flex-1'></span>

      <Badge
        variant='destructive'
        className='max-w-20 self-start'
      ><p className='truncate'>{code}</p></Badge>

    </Button>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIError;
