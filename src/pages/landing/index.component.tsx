import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import ScrollToTop from '@/shared/components/scroll-to-top/index.component.tsx';
import InfoDialog from '@/shared/components/info-dialog/index.component.tsx';
import LargeInfoDialog from '@/shared/components/large-info-dialog/index.component.tsx';
import ContactDialog from '@/pages/landing/contact-dialog/index.component';
import Header from '@/pages/landing/header/index.component.tsx';
import Hero from '@/pages/landing/hero/index.component.tsx';
import PositionSample from '@/pages/landing/position-sample/index.component.tsx';
import Characteristics from '@/pages/landing/characteristics/index.component.tsx';
import Features from '@/pages/landing/features/index.component.tsx';
import Indicators from '@/pages/landing/indicators/index.component.tsx';
import Planner from '@/pages/landing/planner/index.component.tsx';
import Monitoring from '@/pages/landing/monitoring/index.component.tsx';
import Exchanges from '@/pages/landing/exchanges/index.component.tsx';
import Technologies from '@/pages/landing/technologies/index.component.tsx';
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
  const [isContactDialogOpen, setIsContactDialogOpen] = useState<boolean>(false);
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
    (id: ISectionID): void => document.querySelector(`#${id}`)?.scrollIntoView(),
    [],
  );

  /**
   * Opens the contact dialog.
   */
  const openContactDialog = useCallback(() => setIsContactDialogOpen(true), []);

  /**
   * Opens the under construction dialog.
   */
  const openUnderConstructionDialog = useCallback(
    () => openInfoDialog({
      title: 'Under construction',
      content: 'This section is currently under construction and will be available soon. Please check back in a few days.',
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
        <Header
          openUnderConstructionDialog={openUnderConstructionDialog}
          openContactDialog={openContactDialog}
          openLargeInfoDialog={openLargeInfoDialog}
          navigateToSection={navigateToSection}
          navigate={navigate}
        />



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
          className='my-20 md:my-28'
        >
          <PositionSample
            openUnderConstructionDialog={openUnderConstructionDialog}
            breakpoint={breakpoint}
          />
        </div>



        {/* *****************
          * CHARACTERISTICS *
          ***************** */}
        <div
          id='characteristics'
          className='mt-20 md:mt-28'
        >
          <Characteristics />
        </div>



        {/* **********
          * FEATURES *
          ********** */}
        <div
          id='features'
          className='mt-20 md:mt-3'
        >
          <Features
            breakpoint={breakpoint}
            openLargeInfoDialog={openLargeInfoDialog}
            navigateToSection={navigateToSection}
          />
        </div>



        <Separator className='my-20 md:my-28' />



        {/* ************
          * INDICATORS *
          ************ */}
        <div
          id='indicators'
          className='my-20 md:my-28'
        >
          <Indicators
            openLargeInfoDialog={openLargeInfoDialog}
          />
        </div>



        <Separator className='my-20 md:my-28' />



        {/* *********
          * PLANNER *
          ********* */}
        <div
          id='planner'
          className='my-20 md:my-28'
        >
          <Planner
            openUnderConstructionDialog={openUnderConstructionDialog}
            breakpoint={breakpoint}
          />
        </div>



        <Separator className='my-20 md:my-28' />




        {/* ***********
          * MONITORING *
          *********** */}
        <div
          id='monitoring'
          className='my-20 md:my-28'
        >
          <Monitoring />
        </div>



        {/* ***********
          * EXCHANGES *
          *********** */}
        <div
          id='exchanges'
          className='my-20 md:my-28'
        >
          <Exchanges />
        </div>



        {/* **************
          * TECHNOLOGIES *
          ************** */}
        <div
          id='technologies'
          className='my-20 md:my-28'
        >
          <Technologies />
        </div>



        <Separator className='my-20 md:my-28' />



        {/* *****
          * FAQ *
          ***** */}
        <div
          id='faq'
          className='my-20 md:my-28'
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
            openUnderConstructionDialog={openUnderConstructionDialog}
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



      {/* ****************
        * CONTACT DIALOG *
        **************** */}
      <ContactDialog
        isOpen={isContactDialogOpen}
        setIsOpen={setIsContactDialogOpen}
      />



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
