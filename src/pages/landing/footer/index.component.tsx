import { Button } from '@/shared/shadcn/components/ui/button';
import {
  Bitcoin,
  CodeXml,
  EarthLock,
  Github,
  Link,
  ShieldCheck,
} from 'lucide-react';
import { IFooterProps } from '@/pages/landing/footer/types.ts';
import { NavService } from '@/shared/services/nav/index.service';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Footer
 * Component in charge of displaying why people should use balancer.
 */
const Footer = ({
  openLargeInfoDialog,
  navigateToSection,
  navigate,
}: IFooterProps) => (
  <div
    className='w-full flex justify-center items-start bg-primary text-slate-50 shadow-6'
  >
    <footer
      className='w-full md:w-11/12 lg:w-9/12 xl:w-11/12 2xl:w-10/12 py-20 px-3 flex justify-start items-start gap-4'
    >

      {/* *******
        * BRAND *
        ******* */}
      <div>
        <img
          src='logo/logo-light.png'
          alt='Balancer’s Logo'
          width='176'
          height='60'
          className='w-36 sm:w-44'
        />

        <p
          className='font-bold'
        >Trade like a proffessional consistently</p>
        <p
          className='text-sm'
        >
          Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to
          automate the Value Averaging Strategy for Bitcoin
        </p>
      </div>


      {/* **********
        * PLATFORM *
        ********** */}
      <div className='flex flex-col justify-start items-start'>
        <h3>Platform</h3>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.dashboard())}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> Application
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.signIn())}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> Sign in
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.updatePassword())}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> Update password
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openGitHubPage()}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> GitHub
        </Button>
      </div>


      {/* **********
        * PLATFORM *
        ********** */}
      <div className='flex flex-col justify-start items-start'>
        <h3>Repositories</h3>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.dashboard())}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> Application
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.signIn())}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> Sign in
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.updatePassword())}
        >
          <Link aria-hidden='true' className='w-4 h-4 mr-1' /> Update password
        </Button>
      </div>

    </footer>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Footer;
