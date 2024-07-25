import { SWService } from 'sw-service';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Error Component
 * Component in charge of handling errors that can occur when loading lazy loaded routes.
 */
const Error = () => (
  <>
    <h1 className="text-4xl mt-5">Error Component</h1>
    <Button variant='ghost' onClick={SWService.updateApp}>Refresh App</Button>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Error;
