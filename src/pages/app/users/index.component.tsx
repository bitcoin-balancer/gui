import { useCallback } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/shadcn/components/ui/table.tsx';
import { UserService, IUser } from '../../../shared/backend/auth/user/index.service.ts';
import { useAPIRequest } from '../../../shared/hooks/api-request/api-request.hook.ts';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../shared/components/page-load-error/index.component.tsx';
import { dispatch } from './dispatch.ts';
import AddUser from './add-user.component.tsx';
import UserRow from './user-row.component.tsx';
import { IAction } from './types.ts';

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
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIRequest<IUser[]>(UserService.listUsers);




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Dispatches an action to the module's reducer.
   * @param action
   */
  const handleDispatch = useCallback(
    (action: IAction) => dispatch(action, data, setData),
    [data, setData],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (error) {
    return <PageLoadError error={error} />;
  }
  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className='page-container flex justify-center items-start'>
      <section className='w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-6/12'>
        <header className="flex justify-start items-center">
          <h1 className="text-3xl">Users</h1>

          <span className="flex-1"></span>

          <AddUser dispatch={handleDispatch}>
            <div>
              <Button variant='ghost' size='icon' aria-label='Add User' className='sm:hidden'><UserPlus aria-hidden='true' /></Button>
              <Button variant='default' aria-label='Add User' className='hidden sm:flex'><UserPlus aria-hidden='true' className='mr-2' /> Add user</Button>
            </div>
          </AddUser>

        </header>

        {
          data.length
            ? <Table className='mt-5'>
            <TableCaption>A list of users</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nickname</TableHead>
                <TableHead>Authority</TableHead>
                <TableHead>Creation</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map((user) => <UserRow key={user.uid} user={user} dispatch={handleDispatch} />)}
            </TableBody>
          </Table>
            : <p className='text-light text-center text-sm mt-5'>No users were found</p>
        }

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Users;
