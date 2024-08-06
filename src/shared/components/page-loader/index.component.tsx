import { Loader2 } from 'lucide-react';
import { IComponentProps } from '@/shared/components/page-loader/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Page Loader Component
 * Component in charge of displaying a loading spinner while a page is loading.
 */
const PageLoader = ({ variant = 'page' }: IComponentProps) => (
  variant === 'page'
    ? <div
        id='page-loader'
      >
        <Loader2
          className='h-14 w-14 animate-spin'
        />
      </div>
    : <div
        className='flex justify-center items-center my-10'
      >
        <Loader2
          className='h-10 w-10 animate-spin'
        />
      </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PageLoader;
