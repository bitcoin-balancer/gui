import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { isSlugValid } from 'web-utils-kit';
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
  DialogTrigger,
  DialogFooter,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { isAuthorityValid } from '@/shared/backend/validations/index.service.ts';
import { UserService, IAuthority } from '@/shared/backend/auth/user/index.service.ts';
import { IAddUserProps, IAddUserInputs } from '@/pages/app/users/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Add User Component
 * Component in charge of adding users to Balancer
 */
const AddUser = ({ children, dispatch }: IAddUserProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [open, setOpen] = useState(false);
  const form = useForm<IAddUserInputs>({ defaultValues: { nickname: '', authority: '' } });
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
  const onSubmit = (data: IAddUserInputs): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Add user',
      description: `The account ${data.nickname} (${data.authority}) will be created and granted access to Balancer once a password is set`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          const authority = Number(data.authority) as IAuthority;
          const user = await UserService.createUser(data.nickname, authority, confirmation);
          dispatch({ type: 'ADD_USER', payload: user });
          form.reset();
          setOpen(false);
        } catch (e) {
          errorToast(e);
          const { code } = decodeError(e);
          if (code === 3500) {
            form.setError('nickname', { message: `The provided nickname '${data.nickname}' has an invalid format` });
          }
          if (code === 3501) {
            form.setError('nickname', { message: `The nickname '${data.nickname}' is already being used by another user` });
          }
          if (code === 3505) {
            form.setError('authority', { message: `The authority must be a number ranging between 1 and 4. Received '${data.authority}'` });
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
      open={open}
      onOpenChange={setOpen}
    >

      <DialogTrigger asChild>{children}</DialogTrigger>

      <DialogContent>

        <DialogHeader>
          <DialogTitle>Add user</DialogTitle>
          <DialogDescription>
            The user will be created immediately upon submission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              noValidate
            >

              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input
                        type='text'
                        placeholder='satoshi'
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
                    required: (value) => (isSlugValid(value) ? true : 'Enter a valid nickname'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='authority'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Authority</FormLabel>
                    <FormControl>
                      <Input
                        type='number'
                        placeholder='3'
                        {...field}
                        autoComplete='off'
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
                    required: (value) => (isAuthorityValid(Number(value), 4) ? true : 'Enter a valid authority'),
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
                    />} Add user
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
export default AddUser;
