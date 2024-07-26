import { Link } from 'react-router-dom';
import { Button } from '../../shared/shadcn/components/ui/button';
import { NavService } from '../../shared/services/nav/index.service';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Not Found Component
 * Component in charge of handling errors when users try to access routes that don't exist.
 */
const NotFound = () => (
  <>
    <h1 className="text-5xl">Not Found Component</h1>
    <Link to={NavService.landing()}>
      <Button variant='ghost'>Back to landing</Button>
    </Link>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotFound;
