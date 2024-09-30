import { useNavigate } from 'react-router-dom';
import {
  Github,
  LogIn,
  Menu,
  ChartCandlestick,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import ScrollToTop from '@/shared/components/scroll-to-top/index.component.tsx';
import LargeInfoDialog from '@/shared/components/large-info-dialog/index.component.tsx';
import Hero from '@/pages/landing/hero/index.component.tsx';
import PositionSample from '@/pages/landing/position-sample/index.component.tsx';
import Characteristics from '@/pages/landing/characteristics/index.component.tsx';
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
        <Hero
          breakpoint={breakpoint}
          openLargeInfoDialog={openLargeInfoDialog}
          navigateToSection={navigateToSection}
          navigate={navigate}
        />



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



        {/* *****************
          * CHARACTERISTICS *
          ***************** */}
        <div
          id='characteristics'
          className='my-20'
        >
          <Characteristics />
        </div>


        {/* <Separator className='my-20' /> */}



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
