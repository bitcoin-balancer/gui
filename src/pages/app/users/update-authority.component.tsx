import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '../../../shared/shadcn/components/ui/input.tsx';
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
import { authorityValid } from '../../../shared/backend/validations/index.service.ts';
import { IAuthority, UserService } from '../../../shared/backend/auth/user/index.service.ts';
import { useBoundStore } from '../../../shared/store/index.store.ts';
import { IUpdateAuthorityProps, IUpdateAuthorityInputs } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Update Authority Component
 * Component in charge of updating a user's authority.
 */
const UpdateAuthority = ({
  open,
  onOpenChange,
  uid,
  nickname,
  authority,
}: IUpdateAuthorityProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const form = useForm<IUpdateAuthorityInputs>({ defaultValues: { newAuthority: authority } });
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
  const onSubmit = (data: IUpdateAuthorityInputs): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update authority',
      description: `${nickname}’s authority will be changed from ${authority} to ${data.newAuthority}`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          const newAuthority = Number(data.newAuthority) as IAuthority;
          await UserService.updateAuthority(uid, newAuthority, confirmation);
          onOpenChange({ type: 'UPDATE_AUTHORITY', payload: { uid, newAuthority } });
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 3505) {
            form.setError('newAuthority', { message });
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
      <DialogContent>

        <DialogHeader>
          <DialogTitle>Update {nickname}’s authority</DialogTitle>
          <DialogDescription>
            The authority will be changed immediately upon submission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <FormField
                control={form.control}
                name='newAuthority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authority</FormLabel>
                    <FormControl>
                      <Input type='number' placeholder='3' {...field} autoComplete='off' autoFocus disabled={isSubmitting} min={1} max={4} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (authorityValid(Number(value), 4) ? true : 'Enter a valid authority (1 - 4)'),
                  },
                }}
              />

              <DialogFooter>
                <Button type='submit' disabled={isSubmitting} className='mt-7 w-full'>{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Update authority</Button>
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
export default UpdateAuthority;
