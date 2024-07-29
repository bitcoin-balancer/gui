import { useNavigate } from 'react-router-dom';
import {
  Github,
  LogIn,
  Menu,
  ChartCandlestick,
} from 'lucide-react';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';
import { NavService } from '../../shared/services/nav/index.service.ts';
import ScrollToTop from '../../shared/components/scroll-to-top/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Landing Component
 * Component in charge of showcasing the project's mission, vision and core features.
 */
const Landing = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const navigate = useNavigate();





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <main className='min-h-dvh animate-in fade-in duration-700'>

      {/* HEADER */}
      <header id='landing-header' className='flex justify-center items-center gap-3 bg-primary p-4'>

        <img src='logo/logo-light.png' alt='Balancer’s Logo' width='176' height='60' className='w-36 sm:w-44' />

        <span className='flex-1'></span>

        <Button className='bg-primary hover:bg-secondary hidden sm:flex' onClick={NavService.openGitHubPage}><Github className='mr-2' /> View on GitHub</Button>
        <Button className='bg-primary hover:bg-secondary sm:hidden' size='icon' onClick={NavService.openGitHubPage}><Github /></Button>

        <Button size='icon' className='bg-primary hover:bg-secondary'><Menu /></Button>

      </header>


      {/* HERO SECTION */}
      <section id='landing-hero' className='bg-primary flex justify-center items-center shadow-6'>

        <div className='text-center text-slate-50 p-5 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12'>

          <h1 className='text-4xl sm:text-5xl font-bold'>Trade like a proffessional consistently</h1>

          <p className='text-lg sm:text-xl mt-5'>Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to automate the "Value Averaging Strategy" for Bitcoin</p>

          <div className='flex justify-center items-center mt-10'>

            <Button className='bg-primary hover:bg-secondary hidden sm:flex' size='lg'><ChartCandlestick className='mr-2' /> Learn More</Button>
            <Button className='bg-primary hover:bg-secondary sm:hidden'><ChartCandlestick className='mr-2' /> Learn More</Button>

            <Button className='bg-primary hover:bg-secondary hidden sm:flex' size='lg' onClick={() => navigate(NavService.dashboard())}><LogIn className='mr-2' /> Go to App</Button>
            <Button className='bg-primary hover:bg-secondary sm:hidden' onClick={() => navigate(NavService.dashboard())}><LogIn className='mr-2' /> Go to App</Button>

          </div>

        </div>

      </section>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />





      {/* SCROLL TO TOP */}
      <ScrollToTop />

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Landing;
