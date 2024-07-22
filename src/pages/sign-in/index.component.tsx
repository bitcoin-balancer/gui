import { Link } from 'react-router-dom';
import { Button } from '../../shared/shadcn/components/ui/button';
import { Input } from '../../shared/shadcn/components/ui/input';
import { Label } from '../../shared/shadcn/components/ui/label';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Sign In
 * Component in charge of authenticating users.
 */
const SignIn = () => {
  const as = '';

  return (
    <main className='flex h-dvh'>

      <section className='flex-1 bg-primary p-10'>

        <article className='flex flex-col h-full'>
          <img src='logo/logo-light.png' alt='Balancer Logo' width='192' height='60' className='w-52' />

          <span className='my-auto'></span>

          <blockquote className='text-white self-end'>
            <p className='text-2xl'>
              "Bitcoin is a remarkable cryptographic achievement, and the ability to create 
              something that is not duplicable in the digital world has enormous value."
            </p>
            <p className='text-sm mt-3'>Eric Schmidt, CEO of Google</p>
          </blockquote>

        </article>

      </section>

      <section className='flex-1 self-center p-10'>

        <article className='w-3/6 mx-auto'>
          <h1 className='text-3xl font-bold text-center'>Sign In</h1>
          <p className='text-light text-md text-center'>
            Enter your credentials to log into your account
          </p>

          <div className='mt-5'>
            <Label htmlFor='nickname'>Nickname</Label>
            <Input
              id='nickname'
              type='text'
              placeholder='JohnDoe'
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

          <Button type='submit' variant='default' className='bg-primary mt-7 w-full'>Sign In</Button>

          <Button type='submit' variant='outline' className='mt-3 w-full'>Update Password</Button>

          <p className='text-light text-sm mt-6 text-center'>
            If this is the first time you are signing into your account, make sure to set a password
            on it by going through the <Link to='/update-password'><strong>"Update Password"</strong></Link> functionality.
          </p>

        </article>

      </section>

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SignIn;
