import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm, useWatch } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '../../shared/shadcn/components/ui/button';
import { Input } from '../../shared/shadcn/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shared/shadcn/components/ui/form';
import { Toaster } from '../../shared/shadcn/components/ui/toaster';
import { useToast } from '../../shared/shadcn/components/ui/use-toast.ts';
import { errorToast } from '../../shared/services/utils/index.service.ts';
import {
  altchaPayloadValid,
  nicknameValid,
  passwordValid,
} from '../../shared/backend/validations/index.service.ts';
import { AccessJWTService } from '../../shared/backend/api/access-jwt.service.ts';
import { Altcha } from '../../shared/components/altcha/index.component.tsx';
import { UserService } from '../../shared/backend/auth/user/index.service.ts';
import { useBoundStore } from '../../shared/store/index.store.ts';
import GlobalLoader from '../global-loader/index.component.tsx';
import ConfirmationDialog from '../../shared/components/confirmation-dialog/index.component.tsx';
import { IFormInputs } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Update Password Component
 * Component in charge of enabling users to set the password once their accounts are created or in
 * case they forget it in the future.
 */
const UpdatePassword = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);
  const navigate = useNavigate();
  const { toast } = useToast();
  const form = useForm<IFormInputs>({
    defaultValues: {
      nickname: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });
  const newPassword = useWatch({ control: form.control, name: 'newPassword' });
  const [altcha, setAltcha] = useState<string | null | undefined>(undefined);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in in case authentication has not been initialized.
   */
  useEffect(() => {
    if (authenticated === undefined) {
      AccessJWTService.accessJWTChanged(null);
    }
  }, [authenticated]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Triggers whenever the form is submitted. Prior to displaying the confirmation dialog, it will
   * validate the altcha solution. If invalid, it will abort the submission.
   * @param data
   * @returns void
   */
  const onSubmit = (data: IFormInputs): void => {
    // ensure the altcha payload was provided
    if (!altchaPayloadValid(altcha)) {
      setAltcha(null);
      return;
    }

    // display the confirmation dialog
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Confirm Password Update',
      description: 'The password will be set on your account, allowing you to sign into the platform safely.',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await UserService.updatePassword(
            data.nickname,
            data.newPassword,
            confirmation,
            altcha,
          );
          navigate('/sign-in');
        } catch (e) {
          toast(errorToast(e, 'Password Update Error'));
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated) {
    return <Navigate to='/app' />;
  }
  if (authenticated === undefined) {
    return <GlobalLoader />;
  }
  return (
    <main className='flex min-h-dvh animate-in fade-in slide-in-from-right duration-500'>

      <section className='flex-1 self-center p-5 sm:p-10'>

        <article className='w-full sm:w-10/12 md:11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 mx-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <h1 className='text-3xl font-bold text-center'>Update your password</h1>
              <p className='text-light text-md text-center'>Secure your account with a strong password</p>

              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='nakamoto' {...field} autoComplete='off' disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (nicknameValid(value) ? true : 'Enter a valid nickname'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='newPassword'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='********' {...field} autoComplete='off' disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (passwordValid(value) ? true : 'The password must be at least 8 characters long and include at least one lowercase letter, one uppercase letter, one number, and one special character.'),
                  },
                }}
              />

              <FormField
                control={form.control}
                name='confirmNewPassword'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Confirm password</FormLabel>
                    <FormControl>
                      <Input type='password' placeholder='********' {...field} autoComplete='off' disabled={isSubmitting} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
                rules={{
                  validate: {
                    required: (value) => (newPassword === value ? true : 'The passwords don’t match'),
                  },
                }}
              />

              <div className={`mt-6 ${isSubmitting ? 'opacity-50' : ''}`}>
                <Altcha onChange={setAltcha} />
                {altcha === null && <p className='text-error animate-in fade-in duration-500 mt-2 text-sm font-bold'>Prove you're not a robot</p>}
              </div>

              <Button type='submit' disabled={isSubmitting} variant='default' className='bg-primary hover:bg-secondary mt-7 w-full'>{isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />} Update password</Button>

              <Button type='button' onClick={() => navigate('/sign-in')} disabled={isSubmitting} variant='outline' className='mt-3 w-full'>Sign in</Button>

              <p className='text-light text-sm mt-6 text-center'>Make sure to set a password you haven't used in other applications and that nobody is watching/listening to your keystrokes</p>

            </form>

          </Form>

        </article>

      </section>



      <section className='hidden md:block flex-1 bg-primary shadow-8 p-10'>

        <article className='flex flex-col h-full items-end'>
          <Link to='/'><img src='logo/logo-light.png' alt='Balancer Logo' width='192' height='60' className='w-48' /></Link>

          <span className='my-auto'></span>

          <blockquote className='text-white text-right'>
            <p className='text-2xl'>“We have elected to put our money and faith in a mathematical framework that is free of politics and human error.“</p>
            <p className='text-sm mt-3'>Tyler Winklevoss, co-CEO of Gemini</p>
          </blockquote>

        </article>

      </section>



      {/* CONFIRMATION DIALOG */}
      <ConfirmationDialog />





      {/* TOASTR */}
      <Toaster />

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default UpdatePassword;
