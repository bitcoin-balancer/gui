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
import { NavService } from '../../shared/services/nav/index.service.ts';
import { AccessJWTService } from '../../shared/backend/api/access-jwt.service.ts';
import { useBoundStore } from '../../shared/store/index.store.ts';
import GlobalLoader from '../global-loader/index.component.tsx';

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
      <header className='flex justify-center items-center p-3 border-b border-slate-200'>

        <Link to={NavService.landing()}><img src='logo/logo-dark.png' alt='Balancer’s Logo' width='176' height='60' className='w-32 lg:w-36' /></Link>

        <span className='flex-1'></span>

        <nav className='flex justify-center items-center gap-3'>
          <Button variant='ghost' className='hidden md:flex'>
            <House className='mr-2' /> Dashboard
          </Button>
          <Button variant='ghost' className='hidden md:flex'>
            <ArrowLeftRight className='mr-2' /> Positions
          </Button>
          <Button variant='ghost' className='hidden md:flex'>
            <Server className='mr-2' /> Server
          </Button>
          <Button variant='ghost' className='hidden md:flex'>
            <SlidersHorizontal className='mr-2' /> Adjustments
          </Button>
          <Button variant='ghost' size='icon'>
            <Menu />
          </Button>
        </nav>

      </header>





      {/* ROUTER OUTLET */}
      <Outlet />

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
