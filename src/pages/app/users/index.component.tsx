import { UserPlus } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */



/**
 * Users Component
 * Component in charge of creating, updating, deleting and managing users.
 */
const Users = () => {

  return (
    <section className='page-container'>
      <header className="flex justify-start items-center">
        <h1 className="text-4xl mt-5">Users</h1>

        <span className="flex-1"></span>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='icon' aria-label='Add User'><UserPlus aria-hidden='true' /></Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Add user</p>
          </TooltipContent>
        </Tooltip>

      </header>
    </section>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Users;
