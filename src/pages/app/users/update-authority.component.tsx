import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '@/shared/shadcn/components/ui/input.tsx';
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
import { useBoundStore } from '@/shared/store/index.store.ts';
import { authorityValid } from '@/shared/backend/validations/index.service.ts';
import { IAuthority, UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import { IUpdateAuthorityProps, IUpdateAuthorityInputs, IAction } from '@/pages/app/users/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Update Authority Component
 * Component in charge of updating a user's authority.
 */
const UpdateAuthority = ({
  uid,
  nickname,
  authority,
  closeDialog,
}: IUpdateAuthorityProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(() => undefined);
  const form = useForm<IUpdateAuthorityInputs>({ defaultValues: { newAuthority: authority } });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Handles the process of closing the dialog with an action.
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
          __handleCloseDialog({ type: 'UPDATE_AUTHORITY', payload: { uid, newAuthority } });
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
    <Dialog
      open={isDialogOpen}
      onOpenChange={() => __handleCloseDialog(undefined)}
    >

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Update {nickname}’s authority</DialogTitle>
          <DialogDescription>
            The authority will be changed immediately upon submission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >

              <FormField
                control={form.control}
                name='newAuthority'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Authority</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='3'
                        {...field}
                        autoComplete='off'
                        autoFocus
                        disabled={isSubmitting}
                        min={1}
                        max={4}
                      />
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
                <Button
                  type='submit'
                  disabled={isSubmitting}
                  className='mt-7 w-full'
                >
                  {
                    isSubmitting
                    && <Loader2
                      className='mr-2 h-4 w-4 animate-spin'
                    />
                  } Update authority
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
export default UpdateAuthority;
