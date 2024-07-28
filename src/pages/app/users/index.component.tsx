import { UserPlus, EllipsisVertical } from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';
import { Badge } from '../../../shared/shadcn/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../../../shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../../shared/shadcn/components/ui/table.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */



/**
 * Users Component
 * Component in charge of creating, updating, deleting and managing users.
 */
const Users = () => {
  const a = '';
  return (
    <div className='page-container flex justify-center items-start'>
      <section className='w-full sm:w-10/12 md:w-9/12 lg:w-8/12 xl:w-7/12 2xl:w-5/12'>
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

        <Table className='mt-3'>
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
            <TableRow>
              <TableCell>
                <p className='mr-2 font-bold'>root</p>
              </TableCell>
              <TableCell>
                <Badge variant='secondary'>5</Badge>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='sm' className='max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-36 2xl:max-w-40'>
                      <p className='text-ellipsis overflow-hidden font-normal'>6234ca63-426e-472c-9440-5e0b30640a5f</p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant='ghost' size='sm' className='max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-36 2xl:max-w-40'>
                      <p className='text-ellipsis overflow-hidden font-normal'>PJWC6KIPJUWHMAKC</p>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Click to copy</p>
                  </TooltipContent>
                </Tooltip>
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger aria-label='User actions menu'><EllipsisVertical aria-hidden='true'/></DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>root</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Update nickname</DropdownMenuItem>
                    <DropdownMenuItem>Update authority</DropdownMenuItem>
                    <DropdownMenuItem>Update OTP secret</DropdownMenuItem>
                    <DropdownMenuItem>Delete user</DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Display sessions</DropdownMenuItem>
                    <DropdownMenuItem>Display password updates</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
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
