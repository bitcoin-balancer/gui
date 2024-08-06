import {
  useMemo,
  useState,
  useCallback,
  useRef,
} from 'react';
import { flushSync } from 'react-dom';
import {
  GlobeLock,
  Pencil,
  Trash,
  Loader2,
  EllipsisVertical,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table.tsx';
import { IRecord } from '@/shared/types.ts';
import { delay, errorToast } from '@/shared/services/utils/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import { IPBlacklistService, IIPBlacklistRecord } from '@/shared/backend/ip-blacklist/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useAPIRequest } from '@/shared/hooks/api-request/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import { dispatch } from '@/pages/app/ip-blacklist/reducer.ts';
import RecordForm from '@/pages/app/ip-blacklist/record-form.component.tsx';
import { IAction } from '@/pages/app/ip-blacklist/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Formats a date based on the current media query breakpoint.
 * @param date
 * @param breakpoint
 * @returns string
 */
const formatDateByBreakpoint = (date: number, breakpoint: IBreakpoint): string => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
    case 'md':
    case 'lg':
      return formatDate(date, 'datetime-short');
    default:
      return formatDate(date, 'datetime-medium');
  }
};

/**
 * Formats the date for each of the records in state.
 * @param records
 * @param breakpoint
 * @returns IRecord<string>
 */
const buildDates = (
  records: IIPBlacklistRecord[] | undefined,
  breakpoint: IBreakpoint,
): IRecord<string> => (
  Array.isArray(records)
    ? records.reduce(
      (previous, current) => ({
        ...previous,
        [current.id]: formatDateByBreakpoint(current.event_time, breakpoint),
      }),
      {},
    )
    : {}
);





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * IP Address Blacklist Component
 * Component in charge of keeping track of potentially malicious IP Addresses.
 */
const IPBlacklist = () => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLTableSectionElement | null>(null);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIRequest<IIPBlacklistRecord[]>(IPBlacklistService.list, useMemo(() => [LIMIT], []));
  const breakpoint = useMediaQueryBreakpoint();
  const [activeDialog, setActiveDialog] = useState<IIPBlacklistRecord | null | false>(false);
  const [closingDialog, setClosingDialog] = useState<boolean>(false);
  const [busyRecord, setBusyRecord] = useState<number | undefined>();
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the dates for all the records based on the current breakpoint
  const dates: IRecord<string> = useMemo(
    () => buildDates(data, breakpoint),
    [data, breakpoint],
  );





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Prompts the user with the confirmation dialog and unregisters the IP address.
   */
  const unregisterIP = (record: IIPBlacklistRecord) => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Unregister IP',
      description: `The address ${record.ip} will be removed from the blacklist immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setBusyRecord(record.id);
          await IPBlacklistService.unregisterIP(record.id, confirmation);
          dispatch({ type: 'UNREGISTER_IP', payload: record.id }, data, setData);
        } catch (e) {
          errorToast(e);
        } finally {
          setBusyRecord(undefined);
        }
      },
    });
  };

  /**
   * Loads the next set of records if there are any.
   */
  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextRecords = await IPBlacklistService.list(LIMIT, data.at(-1)!.id);

      // add the new records to the DOM
      flushSync(() => {
        dispatch({ type: 'LOADED_MORE', payload: nextRecords }, data, setData);
        setHasMore(nextRecords.length >= LIMIT);
      });

      // scroll to the beginning of the new page
      const el = rowsRef.current?.querySelector(`#ipb-${data.at(-1)!.id}`) as Element;
      el.scrollIntoView(true);
    } catch (e) {
      errorToast(e);
    } finally {
      setLoadingMore(false);
    }
  };

  /**
   * Dispatches an action to the module's reducer.
   * @param action
   */
  const handleDispatch = useCallback(
    async (action: IAction | false) => {
      if (action) {
        dispatch(action, data, setData);
      }
      setClosingDialog(true);
      await delay(0.25);
      setClosingDialog(false);
      setActiveDialog(false);
    },
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
    <>
      <div
        className='page-container flex justify-center items-start animate-in fade-in duration-700'
      >
        <section
          className='w-full lg:w-9/12 xl:w-7/12 2xl:w-6/12'
        >
        {/* ********
          * HEADER *
          ******** */}
          <header
            className='flex justify-start items-center'
          >
            <h1
              className='text-2xl md:text-3xl'
            >IP Blacklist</h1>

            <span className='flex-1'></span>

            <Button
              size='icon'
              aria-label='Register IP Address to the blacklist'
              className='sm:hidden'
              onClick={() => setActiveDialog(null)}
              disabled={typeof busyRecord === 'number'}
            ><GlobeLock aria-hidden='true' /></Button>
            <Button
              aria-label='Register IP Address to the blacklist'
              className='hidden sm:flex'
              onClick={() => setActiveDialog(null)}
              disabled={typeof busyRecord === 'number'}
            ><GlobeLock aria-hidden='true' className='mr-2' /> Register IP</Button>
          </header>

        {/* *******
          * TABLE *
          ******* */}
          {
            data.length
              ? <>
                  <Table className='mt-5'>
                    <TableCaption>A list of blacklisted IPs</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>IP Address</TableHead>
                        <TableHead>Notes</TableHead>
                        <TableHead>Registration</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody ref={rowsRef}>
                      {data.map((record) => (
                        <TableRow
                          key={record.id}
                          id={`ipb-${record.id}`}
                          className={`${busyRecord === record.id ? 'opacity-50' : ''} animate-in fade-in duration-700`}
                        >
                          {/* ************
                            * IP ADDRESS *
                            ************ */}
                          <TableCell>
                            <Badge
                              variant='secondary'
                              className='max-w-32'
                            ><p className='truncate'>{record.ip}</p></Badge>
                          </TableCell>

                          {/* *******
                            * NOTES *
                            ******* */}
                          <TableCell
                            className='max-w-36 sm:max-w-48'
                          >
                            {
                              typeof record.notes === 'string'
                                ? <p className='truncate'>{record.notes}</p>
                                : <p className='text-light'>N/A</p>
                            }
                          </TableCell>

                          {/* ******
                            * DATE *
                            ****** */}
                          <TableCell><p>{dates[record.id]}</p></TableCell>


                          {/* *********
                            * ACTIONS *
                            ********* */}
                          <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant='ghost'
                                size='icon'
                                aria-label='IP Blacklist actions menu'
                                disabled={busyRecord === record.id}
                              >
                                {
                                  busyRecord === record.id
                                    ? <Loader2 className='animate-spin' />
                                    : <EllipsisVertical aria-hidden='true'/>
                                }
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuLabel
                                className='max-w-36'
                              ><p className='truncate'>{record.ip}</p>
                              </DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                onClick={() => setActiveDialog(record)}
                              >
                                  <Pencil
                                    aria-hidden='true'
                                    className='w-5 h-5 mr-1'
                                  /> Update registration
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => unregisterIP(record)}
                                aria-label='Unregister IP address from the blacklist'
                              >
                                <Trash
                                  aria-hidden='true'
                                  className='w-5 h-5 mr-1'
                                /> Unregister IP
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>

                  {/* ******************
                    * LOAD MORE BUTTON *
                    ****************** */}
                  {
                    (hasMore && data.length >= LIMIT)
                    && <Button
                      variant='ghost'
                      className='w-full'
                      onClick={loadMore}
                      disabled={loadingMore}
                    >
                      {
                        loadingMore
                        && <Loader2
                          className='mr-2 h-4 w-4 animate-spin'
                        />} Load more
                    </Button>
                  }
              </>
              : <p
                className='text-light text-center text-sm mt-5'
              >No records were found</p>
          }

        </section>
      </div>



      {/* **************
        * FORM DIALOGS *
        ************** */}
      {
        activeDialog !== false
        && <RecordForm
          open={closingDialog ? false : activeDialog}
          onOpenChange={handleDispatch}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default IPBlacklist;
