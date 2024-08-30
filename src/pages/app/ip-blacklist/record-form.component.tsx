import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
import { Textarea } from '@/shared/shadcn/components/ui/textarea.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ipNotesValid, ipValid } from '@/shared/backend/validations/index.service.ts';
import { IPBlacklistService } from '@/shared/backend/ip-blacklist/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IRecordFormProps, IRecordFormInputs, IAction } from '@/pages/app/ip-blacklist/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Record Form Component
 * Component in charge of creating and updating records.
 */
const RecordForm = ({ record, closeDialog }: IRecordFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(() => undefined);
  const form = useForm<IRecordFormInputs>({
    defaultValues: {
      ip: record ? record.ip : '',
      notes: record ? record.notes || '' : '',
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Handles the closing of the dialog. An action can be provided to manage the state in the parent
   * component.
   * @param action
   * @returns Promise<void>
   */
  const __handleCloseDialog = async (action: IAction | undefined): Promise<void> => {
    await handleCloseDialog();
    closeDialog(action);
  };

  /**
   * Triggers whenever the form is submitted and it prompts the user with the confirmation dialog.
   * @param data
   * @returns void
   */
  const onSubmit = (data: IRecordFormInputs): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: record === null ? 'Register IP' : 'Update Registration',
      description: record === null
        ? `The IP address ${data.ip} will be blacklisted immediately upon submission`
        : `The changes will be applied to the IP address ${data.ip} immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);

          // handle the action accordingly
          const notes = data.notes.length === 0 ? undefined : data.notes;
          if (record) {
            await IPBlacklistService.updateIPRegistration(record.id, data.ip, notes, confirmation);
            __handleCloseDialog({
              type: 'UPDATE_REGISTRATION',
              payload: { id: record.id, ip: data.ip, notes },
            });
          } else {
            const payload = await IPBlacklistService.registerIP(data.ip, notes, confirmation);
            __handleCloseDialog({ type: 'REGISTER_IP', payload });
          }
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 5250 || code === 5252 || code === 5253) {
            form.setError('ip', { message });
          }
          if (code === 5251) {
            form.setError('notes', { message });
          }
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => __handleCloseDialog(undefined)}>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>{record === null ? 'Register IP' : 'Update registration'}</DialogTitle>
          <DialogDescription>
            {
              record === null
                ? 'The IP address will be blacklisted immediately upon submission'
                : 'The changes will be applied immediately upon submission'
            }
          </DialogDescription>
        </DialogHeader>

        {
          record
          && <>
            <div
              className='flex justify-start items-center'
            >
              <p
                className='text-light text-xs sm:text-sm'
              >ID</p>
              <span className='flex-1'></span>
              <p>{record.id}</p>
            </div>
            <div
              className='flex justify-start items-center'
            >
              <p
                className='text-light text-xs sm:text-sm'
              >Registration</p>
              <span className='flex-1'></span>
              <p
                className='text-sm sm:text-md'
              >{formatDate(record.event_time, 'datetime-medium')}</p>
            </div>
          </>
        }

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <FormField
                control={form.control}
                name='ip'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP address</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='192.0.2.126'
                        {...field}
                        autoComplete='off'
                        autoFocus
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (ipValid(value) ? true : 'Enter a valid IP address'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='notes'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Notes (Optional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder='Explain why the IP address should not be served by the API'
                        rows={7}
                        autoComplete='false'
                        {...field}
                        disabled={isSubmitting}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (value.length > 0 && !ipNotesValid(value) ? 'Enter a valid description of the event or clear the text area' : true),
                  },
                }}
              />

              <DialogFooter>
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='mt-7 w-full'
                >
                  {
                    isSubmitting
                    && <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                    />} {record === null ? 'Blacklist IP' : 'Update registration'}
                </Button>
              </DialogFooter>

            </form>
          </Form>

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default RecordForm;
