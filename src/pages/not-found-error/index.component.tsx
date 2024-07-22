import { Link } from 'react-router-dom';
import { Button } from '../../shared/shadcn/components/ui/button';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Not Found Error
 * Component in charge of handling errors when users try to access routes that don't exist.
 */
const NotFoundError = () => (
  <>
    <h1 className="text-5xl">Not Found Error Component</h1>
    <Link to='/'>
      <Button variant='ghost'>Back to landing</Button>
    </Link>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotFoundError;
