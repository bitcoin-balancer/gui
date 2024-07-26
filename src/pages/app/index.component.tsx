import { useEffect } from 'react';
import { Link, Navigate, Outlet } from 'react-router-dom';
import {
  House,
  ArrowLeftRight,
  Server,
  SlidersHorizontal,
  Menu,
} from 'lucide-react';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../shared/shadcn/components/ui/badge.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shared/shadcn/components/ui/tooltip.tsx';
import { NavService } from '../../shared/services/nav/index.service.ts';
import { AccessJWTService } from '../../shared/backend/api/access-jwt.service.ts';
import { useBoundStore } from '../../shared/store/index.store.ts';
import GlobalLoader from '../global-loader/index.component.tsx';
import AppInstaller from '../../shared/components/app-installer/index.component.tsx';
import OnlineStatus from '../../shared/components/online-status/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * App Component
 * Component that serves as the parent of the application itself for authenticated users.
 */
const App = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in in case authentication has not been initialized.
   */
  useEffect(() => {
    if (authenticated === undefined) {
      AccessJWTService.accessJWTChanged(null);
    }
  }, [authenticated]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated === false) {
    return <Navigate to={NavService.signIn()} />;
  }
  if (authenticated === undefined) {
    return <GlobalLoader />;
  }
  return (
    <main className='animate-in fade-in duration-700'>

      {/* HEADER */}
      <header className='flex justify-center items-center p-4 border-b border-slate-200'>

        <Link to={NavService.landing()}><img src='logo/logo-dark.png' alt='Balancer’s Logo' width='176' height='60' className='w-32 lg:w-36' /></Link>

        <span className='flex-1'></span>

        <nav className='flex justify-center items-center gap-3'>

          {/* MD BUTTONS */}
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' className='hidden md:flex lg:hidden' size='lg' aria-label='Dashboard' disabled={true}>
                  <House aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Dashboard</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' className='hidden md:flex lg:hidden' size='lg' aria-label='Positions'>
                  <ArrowLeftRight aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Positions</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' className='hidden md:flex lg:hidden' size='lg' aria-label='Server'>
                  <Server aria-hidden='true' />
                  <Badge className='bg-primary -ml-2 text-xs -mt-8 rounded-full py-0.5 px-1.5'>9+</Badge>
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Server</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider delayDuration={300}>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button variant='ghost' className='hidden md:flex lg:hidden' size='lg' aria-label='Adjustments'>
                  <SlidersHorizontal aria-hidden='true' />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Adjustments</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>



          {/* LG BUTTONS */}
          <Button variant='ghost' className='hidden lg:flex' size='lg' disabled={true}>
            <House className='mr-2' aria-hidden='true' /> Dashboard
          </Button>
          <Button variant='ghost' className='hidden lg:flex' size='lg'>
            <ArrowLeftRight className='mr-2' aria-hidden='true' /> Positions
          </Button>
          <Button variant='ghost' className='hidden lg:flex' size='lg'>
            <Server className='mr-2' aria-hidden='true' /> Server
            <Badge className='bg-primary text-xs -ml-1 -mt-8 rounded-full py-0.5 px-1.5'>9+</Badge>
          </Button>
          <Button variant='ghost' className='hidden lg:flex' size='lg'>
            <SlidersHorizontal className='mr-2' aria-hidden='true' /> Adjustments
          </Button>



          {/* MENU */}
          <Button variant='ghost' className='hidden md:flex' size='lg' aria-label='Menu'>
            <Menu aria-hidden='true' />
          </Button>
          <Button variant='ghost' className='md:hidden' size='icon' aria-label='Menu'>
            <Menu aria-hidden='true' />
          </Button>
        </nav>

      </header>





      {/* ROUTER OUTLET */}
      <Outlet />





      {/* ONLINE STATUS */}
      <OnlineStatus />





      {/* APP INSTALLER */}
      <AppInstaller />

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
