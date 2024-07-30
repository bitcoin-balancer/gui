import { useState, useEffect } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';
import { Input } from '../../shared/shadcn/components/ui/input.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../shared/shadcn/components/ui/form.tsx';
import { Toaster } from '../../shared/shadcn/components/ui/toaster.tsx';
import { errorToast } from '../../shared/services/utils/index.service.ts';
import {
  altchaPayloadValid,
  nicknameValid,
  passwordValid,
} from '../../shared/backend/validations/index.service.ts';
import { NavService } from '../../shared/services/nav/index.service.ts';
import { AccessJWTService } from '../../shared/backend/api/access-jwt.service.ts';
import { Altcha } from '../../shared/components/altcha/index.component.tsx';
import { JWTService } from '../../shared/backend/auth/jwt/index.service.ts';
import { useBoundStore } from '../../shared/store/index.store.ts';
import GlobalLoader from '../global-loader/index.component.tsx';
import ConfirmationDialog from '../../shared/components/confirmation-dialog/index.component.tsx';
import { IFormInputs } from './types.ts';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Sign In Component
 * Component in charge of authenticating users.
 */
const SignIn = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);
  const navigate = useNavigate();
  const form = useForm<IFormInputs>({ defaultValues: { nickname: '', password: '' } });
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
    const loadAuthState = async () => {
      try {
        await AccessJWTService.accessJWTChanged(null);
      } catch (e) {
        errorToast(e);
      }
    };
    if (authenticated === undefined) {
      loadAuthState();
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
      title: 'Sign in',
      description: 'Signing in will grant you access to powerful tools for monitoring, customizing, and enhancing Balancer’s performance.',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await JWTService.signIn(
            data.nickname,
            data.password,
            confirmation,
            altcha,
          );
        } catch (e) {
          errorToast(e, 'Authentication Error');
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
    <main className='flex min-h-dvh animate-in fade-in slide-in-from-left duration-500'>

      <aside className='hidden md:block flex-1 bg-primary shadow-8 p-10'>

        <article className='flex flex-col h-full'>
          <Link to={NavService.landing()}><img src='logo/logo-light.png' alt='Balancer Logo' width='192' height='60' className='w-48' /></Link>

          <span className='my-auto'></span>

          <blockquote className='text-white'>
            <p className='text-2xl'>"Bitcoin is a remarkable cryptographic achievement, and the ability to create something that is not duplicable in the digital world has enormous value."</p>
            <p className='text-sm mt-3'>Eric Schmidt, Former CEO of Google</p>
          </blockquote>

        </article>

      </aside>

      <section className='flex-1 self-center p-5 sm:p-10'>

        <article className='w-full sm:w-10/12 md:11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 mx-auto'>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} noValidate>

              <h1 className='text-3xl font-bold text-center'>Sign in</h1>
              <p className='text-light text-md text-center'>Enter your credentials to log into your account</p>

              <FormField
                control={form.control}
                name='nickname'
                render={({ field }) => (
                  <FormItem className='mt-5'>
                    <FormLabel>Nickname</FormLabel>
                    <FormControl>
                      <Input type='text' placeholder='satoshi' {...field} autoComplete='off' autoFocus disabled={isSubmitting} />
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
                name='password'
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
                    required: (value) => (passwordValid(value) ? true : 'Enter a valid password'),
                  },
                }}
              />

              <div className={`mt-6 ${isSubmitting ? 'opacity-50' : ''}`}>
                <Altcha onChange={setAltcha} />
                {altcha === null && <p className='text-error animate-in fade-in duration-500 mt-2 text-sm font-bold'>Prove you're not a robot</p>}
              </div>

              <Button type='submit' disabled={isSubmitting} className='mt-7 w-full'>{isSubmitting && <Loader2 className='mr-2 h-4 w-4 animate-spin' />} Sign in</Button>

              <Button type='button' onClick={() => navigate(NavService.updatePassword())} disabled={isSubmitting} variant='outline' className='mt-3 w-full'>Update password</Button>

              <p className='text-light text-sm mt-6 text-center'>If this is the first time you are signing into your account, go through the <Link to={NavService.updatePassword()}><strong>'Update password'</strong></Link> section to set a password on it</p>

            </form>

          </Form>

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
export default SignIn;
