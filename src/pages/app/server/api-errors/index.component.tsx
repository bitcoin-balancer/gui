import {
  memo,
  useState,
  useMemo,
  useRef,
  Fragment,
  useCallback,
} from 'react';
import { flushSync } from 'react-dom';
import { Menu, Trash, Loader2 } from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '../../../../shared/shadcn/components/ui/card.tsx';
import { Separator } from '../../../../shared/shadcn/components/ui/separator.tsx';
import { delay, errorToast } from '../../../../shared/services/utils/index.service.ts';
import { APIErrorService, IAPIError } from '../../../../shared/backend/api-error/index.service.ts';
import { useBoundStore } from '../../../../shared/store/index.store.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';
import APIError from './api-error.component.tsx';
import { IServerComponentProps } from '../types.ts';
import APIErrorDialog from './api-error-dialog.component.tsx';

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
const APIErrors = memo(({ setSidenavOpen }: IServerComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const rowsRef = useRef<HTMLDivElement | null>(null);





  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const {
    data,
    setData,
    loading,
    error,
  } = useAPIRequest<IAPIError[]>(APIErrorService.list, useMemo(() => [LIMIT], []));
  const [activeDialog, setActiveDialog] = useState<{ open: boolean, record?: IAPIError }>({
    open: false,
  });
  const [closingDialog, setClosingDialog] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [loadingMore, setLoadingMore] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





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

  /**
   * Initializes the process to dismiss a dialog.
   */
  const handleOnOpenChange = useCallback(
    async () => {
      setClosingDialog(true);
      await delay(0.25);
      setClosingDialog(false);
      setActiveDialog({ open: false, record: undefined });
    },
    [],
  );

  /**
   * Loads the next set of records if there are any.
   */
  const loadMore = async () => {
    try {
      setLoadingMore(true);
      const nextRecords = await APIErrorService.list(LIMIT, data.at(-1)!.id);

      // add the new records to the DOM
      flushSync(() => {
        setData([...data, ...nextRecords]);
        setHasMore(nextRecords.length >= LIMIT);
      });

      // scroll to the beginning of the new page
      const el = rowsRef.current?.querySelector(`#aer-${data.at(-1)!.id}`) as Element;
      el.scrollIntoView(true);
    } catch (e) {
      errorToast(e);
    } finally {
      setLoadingMore(false);
    }
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
      <div className='page-container flex justify-center items-start animate-in fade-in duration-700'>
        <section className='w-full lg:w-11/12 xl:w-10/12 2xl:w-9/12'>

          {/* HEADER */}
          <header className='flex justify-start items-center mt-2 mb-5'>
            <Button variant='ghost' size='icon' className='mr-2 md:hidden' onClick={() => setSidenavOpen(true)} aria-label='Open Side Navigation'><Menu aria-hidden='true' /></Button>
            <h1 className='text-2xl md:text-3xl font-bold'>API Errors</h1>
            <span className='flex-1'></span>

            <Button onClick={deleteAll} disabled={isSubmitting || data.length === 0} className='hidden sm:flex'>
              <Trash aria-hidden='true' className='mr-2' /> Delete all
            </Button>
            <Button onClick={deleteAll} disabled={isSubmitting || data.length === 0} className='sm:hidden' size='icon' aria-label='Delete all of the API Errors'>
              <Trash aria-hidden='true' />
            </Button>
          </header>



          {/* CONTENT */}
          {
            data.length > 0
              ? <Card>
              <CardContent ref={rowsRef} className='p-0'>
                {data.map((record, i) => (
                  <Fragment key={record.id}>
                    <APIError id={`aer-${record.id}`} data={record} openDialog={() => setActiveDialog({ open: true, record })} />
                    {i < data.length - 1 && <Separator />}
                  </Fragment>
                ))}
              </CardContent>
            </Card>
              : <p className='text-light text-center text-sm mt-5'>No records were found</p>
          }
          {(hasMore && data.length >= LIMIT) && <Button variant='ghost' className='w-full' onClick={loadMore} disabled={loadingMore}>{loadingMore && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Load more</Button>}
        </section>
      </div>

      {/* ERROR DIALOG */}
      {
        activeDialog.record !== undefined
        && <APIErrorDialog
            open={closingDialog ? false : activeDialog.open}
            record={activeDialog.record}
            onOpenChange={handleOnOpenChange} />
      }
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrors;
