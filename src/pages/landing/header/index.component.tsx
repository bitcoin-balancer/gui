import { Github, Menu } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { NavService } from '@/shared/services/nav/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Header
 * Component in charge of displaying the introduction to the project.
 */
const Header = () => (
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
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Header;
