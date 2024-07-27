import { Loader2 } from 'lucide-react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Page Loader Component
 * Component in charge of displaying a loading spinner while a page is loading.
 */
const PageLoader = () => (
  <div id='page-loader' className="flex justify-center items-center">
    <Loader2 className="mr-2 h-14 w-14 animate-spin" />
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PageLoader;
