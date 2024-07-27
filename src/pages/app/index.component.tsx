import { useMemo, useEffect } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useLocation,
  Outlet,
} from 'react-router-dom';
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
import { IMainNavigationItem } from './types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the number of ms a tooltip will wait until being displayed on hover
const TOOLTIP_DELAY = 100;





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Formats the number that will be inserted in a badge so it doesn't take too much space.
 * @param count
 * @returns string | undefined
 */
const formatBadgeCount = (count: number): string | undefined => {
  if (count === 0) {
    return undefined;
  }
  if (count >= 9) {
    return '9+';
  }
  return String(count);
};





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
  const navigate = useNavigate();
  const location = useLocation();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  const mainNavigationItems: IMainNavigationItem[] = useMemo(
    () => ([
      {
        active: NavService.dashboard() === location.pathname,
        name: 'Dashboard',
        path: NavService.dashboard(),
        icon: <House aria-hidden='true' />,
      },
      {
        active: NavService.positions() === location.pathname,
        name: 'Positions',
        path: NavService.positions(),
        icon: <ArrowLeftRight aria-hidden='true' />,
      },
      {
        active: NavService.server() === location.pathname,
        name: 'Server',
        path: NavService.server(),
        icon: <Server aria-hidden='true' />,
        badge: formatBadgeCount(10),
      },
      {
        active: NavService.adjustments() === location.pathname,
        name: 'Adjustments',
        path: NavService.adjustments(),
        icon: <SlidersHorizontal aria-hidden='true' />,
      },
    ]),
    [location],
  );




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
    <main className='animate-in fade-in duration-700 min-h-dvh'>

      {/* HEADER */}
      <header id='app-header' className='flex justify-center items-center border-b border-slate-200'>

        <Link to={NavService.landing()}><img src='/logo/logo-dark.png' alt='Balancer’s Logo' width='176' height='60' className='w-32 lg:w-36' /></Link>

        <span className='flex-1'></span>

        {/* TOP NAVIGATION */}
        <nav className='flex justify-center items-center gap-3 md:gap-5'>

          {/* MD BUTTONS */}
          {mainNavigationItems.map((item, i) => (
            <TooltipProvider key={i} delayDuration={TOOLTIP_DELAY}>
              <Tooltip>
                <TooltipTrigger asChild>
                  {
                  item.badge
                    ? <Button variant='ghost' className='hidden md:flex lg:hidden relative' aria-label={item.name} onClick={() => navigate(item.path)} disabled={item.active}>
                        {item.icon}
                        <div className="absolute -top-2 -right-3">
                          <Badge className='bg-primary py-0.5 px-1.5'>{item.badge}</Badge>
                        </div>
                      </Button>
                    : <Button variant='ghost' className='hidden md:flex lg:hidden' aria-label={item.name} onClick={() => navigate(item.path)} disabled={item.active}>
                        {item.icon}
                      </Button>
                  }
                </TooltipTrigger>
                <TooltipContent>
                  <p>{item.name}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          ))}



          {/* LG BUTTONS */}
          {mainNavigationItems.map((item, i) => (
            item.badge
              ? <Button key={i} variant='ghost' className='hidden lg:flex relative' onClick={() => navigate(item.path)} disabled={item.active}>
                {item.icon} <span className='ml-2'>{item.name}</span>
                <div className="absolute -top-2 -right-2">
                  <Badge className='bg-primary py-0.5 px-1.5'>{item.badge}</Badge>
                </div>
              </Button>
              : <Button key={i} variant='ghost' className='hidden lg:flex' onClick={() => navigate(item.path)} disabled={item.active}>
                {item.icon} <span className='ml-2'>{item.name}</span>
              </Button>
          ))}



          {/* MENU */}
          <TooltipProvider delayDuration={TOOLTIP_DELAY}>
            <Tooltip>
              <TooltipTrigger asChild>
                <div>
                  <Button variant='ghost' className='hidden md:flex' aria-label='Menu'>
                    <Menu aria-hidden='true' />
                  </Button>
                  <Button variant='ghost' className='md:hidden' size='icon' aria-label='Menu'>
                    <Menu aria-hidden='true' />
                  </Button>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Menu</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </nav>

      </header>





      {/* ROUTER OUTLET */}
      <Outlet />





      {/* BOTTOM NAVIGATION */}
      <nav className='fixed bottom-0 left-0 z-10 border-t border-t-slate-200 flex justify-center items-center w-full md:hidden'>

        {mainNavigationItems.map((item, i) => (
          item.badge
            ? <Button key={i} variant='ghost' size='icon' className='h-14 flex-1 rounded-none' aria-label={item.name} onClick={() => navigate(item.path)} disabled={item.active}>
                <div className='relative'>
                  {item.icon}
                  <div className="absolute -top-5 -right-5">
                    <Badge className='bg-primary py-0.5 px-1.5'>{item.badge}</Badge>
                  </div>
                </div>
              </Button>
            : <Button key={i} variant='ghost' size='icon' className='h-14 flex-1 rounded-none' aria-label={item.name} onClick={() => navigate(item.path)} disabled={item.active}>
                {item.icon}
              </Button>
        ))}

      </nav>





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
