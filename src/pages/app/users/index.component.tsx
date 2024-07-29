import { UserPlus } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/shadcn/components/ui/table.tsx';
import { UserService, IUser } from '../../../shared/backend/auth/user/index.service.ts';
import useAPIRequest from '../../../shared/hooks/api-request/api-request.hook.tsx';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import UserRow from './user-row.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */



/**
 * Users Component
 * Component in charge of creating, updating, deleting and managing users.
 */
const Users = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest(UserService.listUsers);

  console.log(data);


  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (loading) {
    return <PageLoader />;
  }
  if (error) {
    return <p>Error!</p>;
  }
  return (
    <div className='page-container flex justify-center items-start'>
      <section className='w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12'>
        <header className="flex justify-start items-center">
          <h1 className="text-3xl">Users</h1>

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

        <Table className='mt-5'>
          <TableCaption>A list of users</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Nickname</TableHead>
              <TableHead>Authority</TableHead>
              <TableHead>ID</TableHead>
              <TableHead>OTP Secret</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            <UserRow />
          </TableBody>
        </Table>

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Users;
