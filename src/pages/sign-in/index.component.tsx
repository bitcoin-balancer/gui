import { FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Altcha } from '../../shared/components/altcha/index.component.tsx';
import { Button } from '../../shared/shadcn/components/ui/button';
import { Input } from '../../shared/shadcn/components/ui/input';
import { Label } from '../../shared/shadcn/components/ui/label';
import { Toaster } from '../../shared/shadcn/components/ui/toaster';
import { useBoundStore } from '../../shared/store/index.store.ts';
import ConfirmationDialog from '../../shared/components/confirmation-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Sign In
 * Component in charge of authenticating users.
 */
const SignIn = () => {
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const handleAltchaVerification = (payload: string) => {
    console.log(payload);
  };





  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Confirm Authentication',
      description: 'Sign in to access powerful tools for monitoring, customizing, and enhancing Balancer’s performance.',
      onConfirmation: async (confirmation: string) => {
        console.log(`In sign-in: ${confirmation}`);
      },
    });
  };





  return (
    <main className='flex min-h-dvh'>

      <section className='hidden md:block flex-1 bg-primary shadow-2xl p-10'>

        <article className='flex flex-col h-full'>
          <img src='logo/logo-light.png' alt='Balancer Logo' width='192' height='60' className='w-48' />

          <span className='my-auto'></span>

          <blockquote className='text-white self-end'>
            <p className='text-2xl'> "Bitcoin is a remarkable cryptographic achievement, and the ability to create something that is not duplicable in the digital world has enormous value."</p>
            <p className='text-sm mt-3'>Eric Schmidt, CEO of Google</p>
          </blockquote>

        </article>

      </section>

      <section className='flex-1 self-center p-5 sm:p-10'>

        <article className='w-full sm:w-10/12 md:11/12 lg:w-9/12 xl:w-7/12 2xl:w-6/12 mx-auto'>
          <form onSubmit={handleSubmit} noValidate>

            <h1 className='text-3xl font-bold text-center'>Sign In</h1>
            <p className='text-light text-md text-center'>Enter your credentials to log into your account</p>

            <div className='mt-5'>
              <Label htmlFor='nickname'>Nickname</Label>
              <Input
                id='nickname'
                type='text'
                placeholder='Satoshi'
                autoComplete='false'
              />
            </div>

            <div className='mt-5'>
              <Label htmlFor='password'>Password</Label>
              <Input
                id='password'
                type='password'
                placeholder='********'
                autoComplete='false'
              />
            </div>

            <div className='mt-6'><Altcha onChange={handleAltchaVerification}/></div>

            <Button type='submit' variant='default' className='bg-primary mt-7 w-full'>Sign In</Button>

            <Link to='/update-password'><Button type='button' variant='outline' className='mt-3 w-full'>Update Password</Button></Link>

            <p className='text-light text-sm mt-6 text-center'>If this is the first time you are signing into your account, go through the <Link to='/update-password'><strong>"Update Password"</strong></Link> section to set a password on it.</p>

          </form>

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
