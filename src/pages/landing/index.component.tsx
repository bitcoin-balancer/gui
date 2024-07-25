import { useNavigate } from 'react-router-dom';
import { Github, LogIn, Menu } from 'lucide-react';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';
import { openURL } from '../../shared/services/utils/index.service.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the URL to the project's GitHub Page
const GITHUB_URL = 'https://github.com/bitcoin-balancer';





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Landing
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
      <header className='flex justify-center items-center gap-3 bg-primary p-4'>

        <img src='logo/logo-light.png' alt='Balancer’s Logo' width='176' height='60' className='w-36 sm:w-44 md:w-48' />

        <span className='flex-1'></span>

        <Button size='icon' className='bg-primary hover:bg-secondary'><Menu /></Button>

      </header>


      {/* HERO SECTION */}
      <section className='bg-primary h-[425px] sm:h-[550px] lg:h-[625px] xl:h-[700px] flex justify-center items-center shadow-6'>

        <div className='text-center text-slate-50 p-5 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12'>

          <h1 className='text-4xl sm:text-5xl font-bold'>Trade like a proffessional consistently</h1>

          <p className='text-lg sm:text-xl mt-5'>Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to automate the "Value Averaging Strategy" for Bitcoin</p>

          <div className='flex justify-center items-center mt-10'>

            <Button className='bg-primary hover:bg-secondary hidden sm:flex' size='lg' onClick={() => openURL(GITHUB_URL)}><Github className='mr-2' /> View on GitHub</Button>
            <Button className='bg-primary hover:bg-secondary sm:hidden' onClick={() => openURL(GITHUB_URL)}><Github className='mr-2' /> GitHub</Button>

            <Button className='bg-primary hover:bg-secondary hidden sm:flex' size='lg' onClick={() => navigate('/app')}><LogIn className='mr-2' /> Go to App</Button>
            <Button className='bg-primary hover:bg-secondary sm:hidden' onClick={() => navigate('/app')}><LogIn className='mr-2' /> Go to App</Button>

          </div>

        </div>

      </section>

      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
      <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Landing;
