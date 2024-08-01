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
import { nicknameValid } from '../../../shared/backend/validations/index.service.ts';
import { UserService } from '../../../shared/backend/auth/user/index.service.ts';
import { useBoundStore } from '../../../shared/store/index.store.ts';
import { IUpdateNicknameProps, IUpdateNicknameInputs } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Update Nickname Component
 * Component in charge of updating a user's nickname.
 */
const UpdateNickname = ({
  open,
  onOpenChange,
  uid,
  nickname,
}: IUpdateNicknameProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const form = useForm<IUpdateNicknameInputs>({ defaultValues: { newNickname: nickname } });
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
  const onSubmit = (data: IUpdateNicknameInputs): void => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update nickname',
      description: `${nickname}'s nickname will be changed to ${data.newNickname}`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await UserService.updateNickname(uid, data.newNickname, confirmation);
          onOpenChange({ type: 'UPDATE_NICKNAME', payload: { uid, newNickname: data.newNickname } });
        } catch (e) {
          errorToast(e);
          const { message, code } = decodeError(e);
          if (code === 3500 || code === 3501) {
            form.setError('newNickname', { message });
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
          <DialogTitle>Update {nickname}’s nickname</DialogTitle>
          <DialogDescription>
            The nickname will be changed immediately upon submission
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <FormField
                control={form.control}
                name='newNickname'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='satoshi' {...field} autoComplete='off' autoFocus disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (nicknameValid(value) ? true : 'Nicknames can be 2 to 16 characters long and include letters, numbers, hyphens, commas, periods, and underscores'),
                  },
                }}
              />

              <DialogFooter>
                <Button type='submit' disabled={isSubmitting} className='mt-7 w-full'>{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Update nickname</Button>
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
export default UpdateNickname;
