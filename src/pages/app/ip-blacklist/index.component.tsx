import { useMemo, useCallback } from 'react';
import {
  GlobeLock,
  Pencil,
  Trash,
  Loader2,
  EllipsisVertical,
} from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
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
import { IPBlacklistService, IIPBlacklistRecord } from '../../../shared/backend/ip-blacklist/index.service.ts';
import { useAPIRequest } from '../../../shared/hooks/api-request/api-request.hook.ts';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../shared/components/page-load-error/index.component.tsx';
/* import { dispatch } from './reducer.ts';
import { IAction } from './types.ts'; */

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */



/**
 * IP Address Blacklist Component
 * Component in charge of keeping track of potentially malicious IP Addresses.
 */
const IPBlacklist = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIRequest<IIPBlacklistRecord[]>(
    IPBlacklistService.list,
    useMemo(() => [LIMIT], []),
  );




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Dispatches an action to the module's reducer.
   * @param action
   */
  /* const handleDispatch = useCallback(
    (action: IAction) => dispatch(action, data, setData),
    [data, setData],
  ); */





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
    <div className='page-container flex justify-center items-start animate-in fade-in duration-700'>
      <section className='w-full lg:w-9/12 xl:w-8/12 2xl:w-7/12'>
        <header className="flex justify-start items-center">
          <h1 className="text-3xl">IP Blacklist</h1>

          <span className="flex-1"></span>

          <Button size='icon' aria-label='Register IP Address to the blacklist' className='sm:hidden'><GlobeLock aria-hidden='true' /></Button>
          <Button aria-label='Register IP Address to the blacklist' className='hidden sm:flex'><GlobeLock aria-hidden='true' className='mr-2' /> Register IP</Button>

        </header>

        {
          data.length
            ? <Table className='mt-5'>
            <TableCaption>A list of blacklisted IPs</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>IP Address</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead>Registration</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell><Badge variant='secondary'>192.135.15.105</Badge></TableCell>
                <TableCell className='max-w-24'><p className='truncate'>Lorem ipsum, dolor sit amet consectetur adipisicing elit. Totam porro nobis in similique esse veritatis repellat consequuntur, illum neque eius nostrum. Accusamus beatae vero quia consequatur necessitatibus officia. Facilis, architecto.</p></TableCell>
                <TableCell><p>Wednesday, July 31st, 2024 at 10:59:11 AM</p></TableCell>
                <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant='ghost' size='icon' aria-label='User actions menu' disabled={true}>
                      {true ? <Loader2 className="animate-spin" /> : <EllipsisVertical aria-hidden='true'/>}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>192.135.15.105</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem><Pencil aria-hidden='true' className='w-5 h-5 mr-1' /> Update registration</DropdownMenuItem>
                    <DropdownMenuItem><Trash aria-hidden='true' className='w-5 h-5 mr-1' /> Unregister IP</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
            : <p className='text-light text-center text-sm mt-5'>No records were found</p>
        }

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default IPBlacklist;
