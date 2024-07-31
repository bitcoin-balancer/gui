import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '../../../shared/shadcn/components/ui/input.tsx';
import { Textarea } from '../../../shared/shadcn/components/ui/textarea.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../shared/shadcn/components/ui/dialog.tsx';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import { errorToast } from '../../../shared/services/utils/index.service.ts';
import { ipNotesValid, ipValid } from '../../../shared/backend/validations/index.service.ts';
import { IPBlacklistService } from '../../../shared/backend/ip-blacklist/index.service.ts';
import { useBoundStore } from '../../../shared/store/index.store.ts';
import { IRecordFormProps, IRecordFormInputs } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Record Form Component
 * Component in charge of creating and updating records.
 */
const RecordForm = ({
  open,
  onOpenChange,
  record,
}: IRecordFormProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const form = useForm<IRecordFormInputs>({
    defaultValues: { ip: record?.ip ?? '', notes: record?.notes ?? '' },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

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
          if (record === null) {
            const payload = await IPBlacklistService.registerIP(data.ip, notes, confirmation);
            onOpenChange({ type: 'REGISTER_IP', payload });
          } else {
            await IPBlacklistService.updateIPRegistration(record.id, data.ip, notes, confirmation);
            onOpenChange({
              type: 'UPDATE_REGISTRATION',
              payload: { id: record.id, ip: data.ip, notes },
            });
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
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>

      <DialogContent className='max-h-dvh overflow-y-auto overflow-x-hidden'>

        <DialogHeader>
          <DialogTitle>{record === null ? 'Register IP' : 'Update registration'}</DialogTitle>
          <DialogDescription>
          {record === null ? 'The IP address will be blacklisted immediately upon submission' : 'The changes will be applied immediately upon submission'}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <FormField
                control={form.control}
                name='ip'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>IP address (*)</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='192.0.2.126' {...field} autoComplete='off' autoFocus disabled={isSubmitting} />
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
                  <FormItem>
                    <FormLabel>Notes</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Tell us a little bit about yourself" autoComplete='false' {...field} disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (ipNotesValid(value) ? true : 'Enter a valid description of the event or clear the text area'),
                  },
                }}
              />

              <DialogFooter>
                <Button type='submit' disabled={isSubmitting} className='mt-7 w-full'>{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} {record === null ? 'Blacklist IP' : 'Update registration'}</Button>
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
