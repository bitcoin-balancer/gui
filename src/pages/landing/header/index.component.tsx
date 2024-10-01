import { useState } from 'react';
import {
  ArrowLeftRight,
  ChartLine,
  CodeXml,
  Github,
  ListOrdered,
  Menu,
  MessageCircleQuestion,
  SwatchBook,
  Telescope,
  WandSparkles,
  Mail,
  Scale,
  LockKeyhole,
  LogIn,
  LayoutPanelLeft,
} from 'lucide-react';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { IHeaderProps } from '@/pages/landing/header/types.ts';
import { ISectionID } from '@/pages/landing/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Header
 * Component in charge of displaying the introduction to the project.
 */
const Header = ({
  openContactDialog,
  openLargeInfoDialog,
  navigateToSection,
  navigate,
}: IHeaderProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Closes the side nav and navigates to a section by ID.
   * @param section
   */
  const navigateFromMenu = (section: ISectionID): void => {
    setSidenavOpen(false);
    navigateToSection(section);
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
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


      {/* **************
        * SIDENAV MENU *
        ************** */}
      <Sheet
        open={sidenavOpen}
        onOpenChange={setSidenavOpen}
      >

        <SheetTrigger asChild>
          <div>
            <Button
              size='icon'
              aria-label='Open sidenav menu'
            ><Menu aria-hidden='true' /></Button>
          </div>
        </SheetTrigger>

        <SheetContent
          className='w-64 sm:72 md-80 lg:96 p-4 overflow-y-auto'
        >
          <SheetHeader>
            <SheetTitle className='text-left'>Balancer</SheetTitle>
            <SheetDescription></SheetDescription>
          </SheetHeader>

          <nav className='mt-2'>
            <p
              className='text-light text-sm'
            >Landing page</p>

            <Button
              variant='ghost'
              className='w-full justify-start mt-2'
              onClick={() => navigateFromMenu('position_sample')}
            >
              <SwatchBook
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Position sample
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('characteristics')}
            >
              <ListOrdered
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Characteristics
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('features')}
            >
              <WandSparkles
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Features
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('indicators')}
            >
              <Telescope
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Indicators
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('monitoring')}
            >
              <ChartLine
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Monitoring
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('exchanges')}
            >
              <ArrowLeftRight
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Exchanges
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('technologies')}
            >
              <CodeXml
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Technologies
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromMenu('faq')}
            >
              <MessageCircleQuestion
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> FAQ
            </Button>

            <Separator className='my-5' />


            <p
              className='text-light text-sm'
            >Platform</p>

            <Button
              variant='ghost'
              className='w-full justify-start mt-3'
              onClick={() => navigate(NavService.dashboard())}
            >
              <LayoutPanelLeft
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Application
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigate(NavService.signIn())}
            >
              <LogIn
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Sign in
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigate(NavService.updatePassword())}
            >
              <LockKeyhole
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Update password
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => NavService.openGitHubPage()}
            >
              <Github
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> GitHub page
            </Button>


            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => openLargeInfoDialog('terms')}
            >
              <Scale
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Terms
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={openContactDialog}
            >
              <Mail
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Contact
            </Button>
          </nav>

        </SheetContent>

      </Sheet>
    </header>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Header;
