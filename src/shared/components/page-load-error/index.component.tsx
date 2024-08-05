import { memo } from 'react';
import { AlertCircle } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { SWService } from 'sw-service';
import { Alert, AlertDescription, AlertTitle } from '../../shadcn/components/ui/alert.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '../../shadcn/components/ui/tooltip.tsx';
import { Badge } from '../../shadcn/components/ui/badge.tsx';
import { Button } from '../../shadcn/components/ui/button.tsx';
import { IComponentProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Page Load Error
 * Component in charge of displaying an error that was thrown when retrieving data from the API in
 * order to provide the user with feedback and a button to refresh the app.
 */
const PageLoadError = memo(({ variant = 'page', error }: IComponentProps) => {
  const { message, code } = decodeError(error);
  return (
    <section
      className={`flex justify-center items-center ${variant === 'page' ? 'm-5 sm:m-6 md:m-7 lg:m-8 xl:m-10' : ''}`}
    >

      <Alert
        variant='destructive'
        className='max-w-full sm:max-w-96'
      >

        <AlertTitle
          className='flex justify-start items-center'
        >

          <AlertCircle
            className='h-4 w-4 mr-2'
          />
          <p>Error</p>
          <span className='flex-1'></span>
          <Tooltip>
            <TooltipTrigger>
              <Badge
                variant='destructive'
                className='max-w-20'
              >
                <p
                  className='truncate'
                >{code}</p>
              </Badge>
            </TooltipTrigger>
            <TooltipContent>
              <p>Error code</p>
            </TooltipContent>
          </Tooltip>
        </AlertTitle>
        <AlertDescription
          className='text-center'
        >
          <p
            className='text-left'
          >{message}</p>
          <Button
            variant='ghost'
            className='mt-3'
            onClick={SWService.updateApp}
          >Reload app</Button>
        </AlertDescription>

      </Alert>

    </section>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PageLoadError;
