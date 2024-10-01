import { memo } from 'react';
import {
  Container,
  Github,
  Scale,
  Mail,
  LayoutPanelLeft,
  LogIn,
  LockKeyhole,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { IFooterProps } from '@/pages/landing/footer/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Footer
 * Component in charge of displaying why people should use balancer.
 */
const Footer = memo(({
  openContactDialog,
  openLargeInfoDialog,
  navigate,
}: IFooterProps) => (
  <div
    className='w-full flex justify-center items-start bg-primary text-slate-50 shadow-6'
  >
    <footer
      className='w-full xl:w-11/12 2xl:w-8/12 py-20 md:py-28 px-3 flex flex-col lg:flex-row justify-start items-start gap-10'
    >

      {/* *******
        * BRAND *
        ******* */}
      <div className='flex-1 grow'>
        <img
          src='logo/logo-light.png'
          alt='Balancer’s Logo'
          width='176'
          height='60'
          className='w-36'
        />

        <p
          className='mt-3 text-lg font-bold'
        >Trade like a proffessional consistently</p>
        <p
          className='mt-1 text-sm'
        >
          Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to
          automate the Value Averaging Strategy for Bitcoin
        </p>
      </div>



      {/* **********
        * PLATFORM *
        ********** */}
      <div className='flex-initial flex flex-col justify-start items-start'>
        <h3 className='font-bold'>Platform</h3>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.dashboard())}
        >
          <LayoutPanelLeft aria-hidden='true' className='w-4 h-4 mr-1' /> Application
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.signIn())}
        >
          <LogIn aria-hidden='true' className='w-4 h-4 mr-1' /> Sign in
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => navigate(NavService.updatePassword())}
        >
          <LockKeyhole aria-hidden='true' className='w-4 h-4 mr-1' /> Update password
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openGitHubPage()}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> GitHub page
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => openLargeInfoDialog('terms')}
        >
          <Scale aria-hidden='true' className='w-4 h-4 mr-1' /> Terms
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => openContactDialog()}
        >
          <Mail aria-hidden='true' className='w-4 h-4 mr-1' /> Contact
        </Button>
      </div>


      {/* **************
        * REPOSITORIES *
        ************** */}
      <div className='flex-initial flex flex-col justify-start items-start'>
        <h3 className='font-bold'>Repositories</h3>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openCLIRepo()}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> bitcoin-balancer/cli
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openAPIRepo()}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> bitcoin-balancer/api
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openGUIRepo()}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> bitcoin-balancer/gui
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openCTRepo()}
        >
          <Github aria-hidden='true' className='w-4 h-4 mr-1' /> bitcoin-balancer/ct
        </Button>
      </div>


      {/* ***************
        * DOCKER IMAGES *
        *************** */}
      <div className='flex-initial flex flex-col justify-start items-start'>
        <h3 className='font-bold'>Docker Images</h3>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openPostgresImage()}
        >
          <Container aria-hidden='true' className='w-4 h-4 mr-1' /> postgres
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openAPIImage()}
        >
          <Container aria-hidden='true' className='w-4 h-4 mr-1' /> jesusgraterol/balancer-api
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openGUIImage()}
        >
          <Container aria-hidden='true' className='w-4 h-4 mr-1' /> jesusgraterol/balancer-gui
        </Button>

        <Button
          variant='link'
          className='text-slate-50'
          onClick={() => NavService.openCTImage()}
        >
          <Container aria-hidden='true' className='w-4 h-4 mr-1' /> jesusgraterol/balancer-ct
        </Button>
      </div>

    </footer>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Footer;
