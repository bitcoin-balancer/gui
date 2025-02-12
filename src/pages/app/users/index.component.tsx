import { useCallback, useMemo } from 'react';
import { UserPlus } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table.tsx';
import { UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { dispatch } from './reducer.ts';
import AddUser from '@/pages/app/users/add-user.component.tsx';
import UserRow from '@/pages/app/users/user-row.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import { IAction } from '@/pages/app/users/types.ts';

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
  } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => UserService.listUsers(),
    }),
    [],
  ));



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
    <div
      className='page-container flex justify-center items-start animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-9/12 xl:w-8/12 2xl:w-7/12'
      >

        <header
          className='flex justify-start items-center'
        >
          <h1
            className='text-2xl font-semibold leading-none tracking-tight'
          >Users</h1>

          <span className="flex-1"></span>

          <AddUser
            dispatch={handleDispatch}
          >
            <div>
              <Button
                size='icon'
                aria-label='Add User'
                className='sm:hidden'
              >
                <UserPlus
                  aria-hidden='true'
                  className='w-5 h-5'
                />
              </Button>
              <Button
                aria-label='Add User'
                className='hidden sm:flex'
                >
                  <UserPlus
                    aria-hidden='true'
                    className='w-5 h-5 mr-2'
                  /> Add user
                </Button>
            </div>
          </AddUser>

        </header>

        {
          data.length
            ? <Card className='md:mt-5'>
              <CardContent
                className='pt-0 md:p-0 md:mb-5'
              >
                <Table>
                  <TableCaption>A list of users</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>ID</TableHead>
                      <TableHead>Nickname</TableHead>
                      <TableHead>Authority</TableHead>
                      <TableHead>OTP Secret</TableHead>
                      <TableHead>Creation</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {
                      data.map(
                        (user) => (
                          <UserRow
                            key={user.uid}
                            user={user}
                            dispatch={handleDispatch}
                          />
                        ),
                      )
                    }
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
            : <NoRecords />
        }

      </section>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Users;
