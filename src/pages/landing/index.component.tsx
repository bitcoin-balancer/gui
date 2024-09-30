import { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import ScrollToTop from '@/shared/components/scroll-to-top/index.component.tsx';
import InfoDialog from '@/shared/components/info-dialog/index.component.tsx';
import LargeInfoDialog from '@/shared/components/large-info-dialog/index.component.tsx';
import Header from '@/pages/landing/header/index.component.tsx';
import Hero from '@/pages/landing/hero/index.component.tsx';
import PositionSample from '@/pages/landing/position-sample/index.component.tsx';
import Characteristics from '@/pages/landing/characteristics/index.component.tsx';
import Indicators from '@/pages/landing/indicators/index.component.tsx';
import FAQ from '@/pages/landing/faq/index.component.tsx';
import Footer from '@/pages/landing/footer/index.component.tsx';
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
  const openInfoDialog = useBoundStore((state) => state.openInfoDialog);
  const openLargeInfoDialog = useBoundStore((state) => state.openLargeInfoDialog);
  const navigate = useNavigate();




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Attempts to navigate to a section based on its ID.
   * @param id
   */
  const navigateToSection = useCallback(
    (id: ISectionID): void => {
      document.querySelector(`#${id}`)?.scrollIntoView();
    },
    [],
  );

  /**
   * Opens the contact dialog.
   */
  const openContactDialog = useCallback(
    () => openInfoDialog({
      title: 'Contact',
      description: 'Having issues running the platform? Open a GitHub issue. For other inquiries, contact me at:',
      content: 'jesusgraterol.dev@protonmail.com',
    }),
    [openInfoDialog],
  );





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
        <Header />



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



        {/* ************
          * INDICATORS *
          ************ */}
        <div
          id='indicators'
          className='my-20'
        >
          <Indicators
            openLargeInfoDialog={openLargeInfoDialog}
          />
        </div>


        <Separator className='my-20' />


        {/* *****
          * FAQ *
          ***** */}
        <div
          id='faq'
          className='my-20'
        >
          <FAQ />
        </div>



        {/* ********
          * FOOTER *
          ******** */}
        <div
          id='footer'
        >
          <Footer
            openContactDialog={openContactDialog}
            openLargeInfoDialog={openLargeInfoDialog}
            navigate={navigate}
          />
        </div>



        {/* ***************
          * SCROLL TO TOP *
          *************** */}
        <ScrollToTop />

      </main>



      {/* *************
        * INFO DIALOG *
        ************* */}
      <InfoDialog />



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
