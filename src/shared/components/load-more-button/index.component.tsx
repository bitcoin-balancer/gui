import { memo } from 'react';
import { Loader2 } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { IComponentProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Load More Button Component
 * Component in charge of providing the user with the ability to load more records.
 */
const LoadMoreButton = memo(({
  message = 'Load more',
  className,
  loadMore,
  loadingMore,
}: IComponentProps) => (
  <Button
    variant='ghost'
    className={`w-full ${typeof className === 'string' ? className : ''}`}
    onClick={loadMore}
    disabled={loadingMore}
  >
    {
      loadingMore
      && <Loader2
        className='mr-2 h-4 w-4 animate-spin'
      />
    } {message}
  </Button>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default LoadMoreButton;
