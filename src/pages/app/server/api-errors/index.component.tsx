import {
  memo,
  useState,
  useMemo,
  useRef,
  Fragment,
} from 'react';
import {
  Menu,
  Trash,
  RefreshCcw,
  EllipsisVertical,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { APIErrorService, IAPIError } from '@/shared/backend/api-error/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import LoadMoreButton from '@/shared/components/load-more-button/index.component.tsx';
import { IServerComponentProps } from '@/pages/app/server/types.ts';
import APIError from '@/pages/app/server/api-errors/api-error.component.tsx';
import APIErrorDialog from '@/pages/app/server/api-errors/api-error-dialog.component.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of records that will be retrieved at a time
const LIMIT = 15;





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Errors Component
 * Component in charge of displaying the API Errors.
 */
const APIErrors = memo(({ setSidenavOpen, unreadAPIErrors }: IServerComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    setData,
    loading,
    error,
    refetchData,
    refetching,
    hasMore,
    loadMore,
    loadingMore,
  } = useAPIFetch(useMemo(
    () => ({
      fetchFn: () => APIErrorService.list(LIMIT),
      queryLimit: LIMIT,
    }),
    [],
  ));
  const [activeDialog, setActiveDialog] = useState<IAPIError>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const { authority } = useBoundStore((state) => state.user!);





  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLDivElement | null>(null);
  const unreadRef = useRef<number>(unreadAPIErrors as number);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Prompts the user with the confirmation dialog and deletes all of the API Error records.
   */
  const deleteAll = (): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Delete Errors',
      description: 'All of the existing API Errors will be deleted immediately upon submission',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await APIErrorService.deleteAll(confirmation);
          setData([]);
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };





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
          className='w-full lg:w-11/12 xl:w-10/12 2xl:w-9/12'
        >

          {/* ********
            * HEADER *
            ******** */}
          <header
            className='flex justify-start items-center mb-5'
          >
            <Button
              variant='ghost'
              size='icon'
              className='mr-2 md:hidden'
              onClick={() => setSidenavOpen(true)}
              aria-label='Open Side Navigation'
            ><Menu aria-hidden='true' /></Button>

            <h1
              className='text-2xl font-semibold leading-none tracking-tight'
            >API Errors</h1>
            <span className='flex-1'></span>

            {/* *****************
              * DESKTOP ACTIONS *
              ***************** */}
            <Button
              variant='outline'
              disabled={refetching}
              onClick={refetchData}
              className='mr-2 hidden sm:flex'
              aria-label='Refetch the API Errors'
            >
              <RefreshCcw
                aria-hidden='true'
                className='w-4 h-4 mr-2'
              /> Refresh
            </Button>
            <Button
              onClick={deleteAll}
              disabled={isSubmitting || data.length === 0 || refetching || authority < 3}
              className='hidden sm:flex'
            >
              <Trash
                aria-hidden='true'
                className='w-4 h-4 mr-2'
              /> Delete all
            </Button>

            {/* ****************
              * MOBILE ACTIONS *
              **************** */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className='sm:hidden'
                disabled={isSubmitting || refetching}
              ><EllipsisVertical aria-hidden='true'/></DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={refetchData}
                  aria-label='Refetch the API Errors'
                >
                  <RefreshCcw
                    aria-hidden='true'
                    className='w-4 h-4 mr-2'
                  /> Refresh
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={deleteAll}
                  disabled={data.length === 0 || authority < 3}
                  aria-label='Delete all of the API Errors'
                >
                  <Trash
                    aria-hidden='true'
                    className='w-4 h-4 mr-2'
                  /> Delete all
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>



          {/* *********
            * CONTENT *
            ********* */}
          {
            data.length > 0
              ? <Card>
              <CardContent
                ref={rowsRef}
                className='pt-0 md:p-0'
              >
                {data.map((record, i) => (
                  <Fragment key={record.id}>
                    <APIError
                      id={`aer-${record.id}`}
                      data={record}
                      openDialog={setActiveDialog}
                      isUnread={i < unreadRef.current}
                    />
                    {i < data.length - 1 && <Separator />}
                  </Fragment>
                ))}
              </CardContent>
            </Card>
              : <NoRecords />
          }



          {/* ******************
            * LOAD MORE BUTTON *
            ****************** */}
          {
            (hasMore && data.length >= LIMIT)
            && <LoadMoreButton
              loadMore={() => loadMore(
                () => APIErrorService.list(LIMIT, data.at(-1)!.id),
                rowsRef.current!,
                `aer-${data.at(-1)!.id}`,
              )}
              loadingMore={loadingMore}
            />
          }
        </section>
      </div>





      {/* **************
        * ERROR DIALOG *
        ************** */}
      {
        activeDialog !== undefined
        && <APIErrorDialog
          record={activeDialog}
          closeDialog={setActiveDialog}
        />
      }
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrors;
