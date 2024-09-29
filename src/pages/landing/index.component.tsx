import { useNavigate } from 'react-router-dom';
import {
  Github,
  LogIn,
  Menu,
  ChartCandlestick,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import PositionSample from '@/pages/landing/position-sample/index.component.tsx';
import ScrollToTop from '@/shared/components/scroll-to-top/index.component.tsx';
import LargeInfoDialog from '@/shared/components/large-info-dialog/index.component.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator';
import { ISectionID } from '@/pages/landing/types.ts';

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
  const breakpoint = useMediaQueryBreakpoint();
  const isLargeInfoDialogOpen = useBoundStore((state) => state.isLargeInfoDialogOpen);
  const openLargeInfoDialog = useBoundStore((state) => state.openLargeInfoDialog);
  const navigate = useNavigate();




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Attempts to navigate to a section based on its ID.
   * @param id
   */
  const navigateToSection = (id: ISectionID): void => {
    document.querySelector(`#${id}`)?.scrollIntoView();
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <main
        className='min-h-dvh animate-in fade-in duration-700'
      >

        {/* ********
          * HEADER *
          ******** */}
        <header
          id='landing-header'
          className='flex justify-center items-center gap-3 bg-primary p-4'
        >

          <img
            src='logo/logo-light.png'
            alt='Balancer’s Logo'
            width='176'
            height='60'
            className='w-36 sm:w-44'
          />

          <span className='flex-1'></span>

          <Button
            className='hidden sm:flex'
            onClick={NavService.openGitHubPage}
          ><Github className='mr-2' /> View on GitHub</Button>
          <Button
            className='sm:hidden'
            size='icon'
            onClick={NavService.openGitHubPage}
            aria-label='Open GitHub page on a new tab'
          ><Github aria-hidden='true' /></Button>

          <Button
            size='icon'
            aria-label='Open sidenav menu'
          ><Menu aria-hidden='true' /></Button>

        </header>



        {/* ******
          * HERO *
          ****** */}
        <section
          id='landing-hero'
          className='bg-primary flex justify-center items-center shadow-6'
        >

          <div
            className='text-center text-slate-50 p-5 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12'
          >

            <h1
              className='text-4xl sm:text-5xl font-bold'
            >Trade like a proffessional consistently</h1>

            <p
              className='text-lg sm:text-xl mt-5'
            >
              Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to
              automate the <button onClick={() => openLargeInfoDialog('value_averaging')} className='font-extrabold'>Value Averaging Strategy</button> for Bitcoin
            </p>

            <div
              className='flex justify-center items-center mt-10'
            >

              <Button
                size={breakpoint === 'xs' ? 'default' : 'lg'}
                onClick={() => navigateToSection('position_sample')}
              ><ChartCandlestick className='mr-2' /> Learn more</Button>

              <Button
                size={breakpoint === 'xs' ? 'default' : 'lg'}
                onClick={() => navigate(NavService.dashboard())}
              ><LogIn className='mr-2' /> Go to app</Button>

            </div>

          </div>

        </section>



        {/* *****************
          * POSITION SAMPLE *
          ***************** */}
        <div
          id='position_sample'
          className='my-20'
        >
          <PositionSample
            breakpoint={breakpoint}
          />
        </div>


        <Separator className='my-20' />



        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
        <br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />




        {/* ***************
          * SCROLL TO TOP *
          *************** */}
        <ScrollToTop />

      </main>



      {/* *******************
        * LARGE INFO DIALOG *
        ******************* */}
      {
        isLargeInfoDialogOpen !== undefined
        && <LargeInfoDialog
          data={isLargeInfoDialogOpen}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Landing;
