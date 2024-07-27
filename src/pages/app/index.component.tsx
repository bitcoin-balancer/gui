import { useState, useMemo, useEffect } from 'react';
import {
  Link,
  Navigate,
  useNavigate,
  useNavigation,
  Outlet,
} from 'react-router-dom';
import {
  House,
  ArrowLeftRight,
  Server,
  SlidersHorizontal,
  Menu,
  CodeXml,
  EarthLock,
  Users,
  Database,
  ExternalLink,
  Github,
  LogOut,
} from 'lucide-react';
import { SWService } from 'sw-service';
import { Button } from '../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '../../shared/shadcn/components/ui/tooltip.tsx';
import { Toaster } from '../../shared/shadcn/components/ui/toaster';
import { ToastAction } from '../../shared/shadcn/components/ui/toast';
import { toast } from '../../shared/shadcn/components/ui/use-toast.ts';
import { Separator } from '../../shared/shadcn/components/ui/separator.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../../shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '../../shared/shadcn/components/ui/sheet.tsx';
import { formatBadgeCount } from '../../shared/services/utils/index.service.ts';
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

// the number of ms that will be used by the updater if there is an available update for the app
const APP_UPDATER_DELAY = Math.floor(SWService.registrationDurationSeconds / 2) * 1000;
const APP_UPDATER_DURATION = 15 * 1000;





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
  const [sidenavOpen, setSidenavOpen ] = useState<boolean>(false);
  const authenticated = useBoundStore((state) => state.authenticated);
  const navigate = useNavigate();
  const { state } = useNavigation();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the active URL
  const { pathname } = window.location;

  // the main navigation buttons located at the top on desktop and at the bottom on mobile devices
  const mainNavigationItems: IMainNavigationItem[] = useMemo(
    () => ([
      {
        active: NavService.dashboard() === pathname,
        name: 'Dashboard',
        path: NavService.dashboard(),
        icon: <House aria-hidden='true' />,
      },
      {
        active: NavService.positions() === pathname,
        name: 'Positions',
        path: NavService.positions(),
        icon: <ArrowLeftRight aria-hidden='true' />,
      },
      {
        active: NavService.server() === pathname,
        name: 'Server',
        path: NavService.server(),
        icon: <Server aria-hidden='true' />,
        badge: formatBadgeCount(10),
      },
      {
        active: NavService.adjustments() === pathname,
        name: 'Adjustments',
        path: NavService.adjustments(),
        icon: <SlidersHorizontal aria-hidden='true' />,
      },
    ]),
    [pathname],
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

  /**
   * App Updater
   * Checks if there is an available update for the app and displays the updater.
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      // @TODO
      toast({
        title: 'Version 1.0.0',
        description: 'Enjoy the latest innovations, bug fixes, and enhanced security.',
        action: <ToastAction altText='Update Application' onClick={SWService.updateApp}>Update</ToastAction>,
        duration: APP_UPDATER_DURATION,
      });
    }, APP_UPDATER_DELAY);
    return () => clearTimeout(timeout);
  }, []);





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

      {/* PROGRESS BAR */}
      {state === 'loading' && <div className="progress-bar fixed top-0 left-0"><div className="progress-bar-value"></div></div>}



      {/* HEADER */}
      <header id='app-header' className='flex justify-center items-center border-b border-slate-200'>
        <Tooltip>
          <TooltipTrigger asChild>
            <Link to={NavService.landing()}><img src='/logo/logo-dark.png' alt='Balancer’s Logo' width='176' height='60' className='w-32 lg:w-36' /></Link>
          </TooltipTrigger>
          <TooltipContent>
            <p>v1.0.0</p>
          </TooltipContent>
        </Tooltip>

        <span className='flex-1'></span>

        {/* TOP NAVIGATION */}
        <nav className='flex justify-center items-center gap-3 md:gap-5'>

          {/* MD BUTTONS */}
          {mainNavigationItems.map((item, i) => (
            <Tooltip key={i}>
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



          {/* SIDENAV MENU */}
          <Sheet open={sidenavOpen} onOpenChange={setSidenavOpen}>
            <SheetTrigger asChild>
              <div>
                <Button variant='ghost' className='hidden md:flex' aria-label='Side Navigation Menu'>
                  <Menu aria-hidden='true' />
                </Button>
                <Button variant='ghost' className='md:hidden' size='icon' aria-label='Side Navigation Menu'>
                  <Menu aria-hidden='true' />
                </Button>
              </div>
            </SheetTrigger>
            <SheetContent className='w-64 sm:72 md-80 lg:96 p-4'>
              <SheetHeader>
                <SheetTitle className='flex justify-start items-center'>

                  <img src='/logo/logo-dark.png' alt='Balancer’s Logo' width='80' height='30' className='w-20' />
                  <Badge variant='secondary' className='ml-2'>v1.0.0</Badge>

                </SheetTitle>
                <SheetDescription className='text-left'>

                  <Button variant='link' className='justify-start p-0 -mt-6 text-light text-xs' onClick={NavService.openGitHubPage}>
                    <CodeXml className='mr-1 w-4 h-4' /> 0a23ed6 · last month
                  </Button>

                </SheetDescription>
              </SheetHeader>

              <nav className='mt-4'>

                <Button variant='ghost' className='w-full justify-start'>
                    <EarthLock /> <span className='ml-2'>IP address blacklist</span>
                </Button>
                <Button variant='ghost' className='w-full justify-start'>
                    <Users /> <span className='ml-2'>Users</span>
                </Button>
                <Button variant='ghost' className='w-full justify-start'>
                    <Database /> <span className='ml-2'>browserdb</span>
                </Button>

                <Separator className='my-4' />

                <Button variant='ghost' className='w-full justify-start'>
                    <ExternalLink /> <span className='ml-2'>Create new instance</span>
                </Button>
                <Button variant='ghost' className='w-full justify-start'>
                    <Github /> <span className='ml-2'>View on GitHub</span>
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                  <Button variant='ghost' className='w-full justify-start'>
                    <LogOut /> <span className='ml-2'>Sign out</span>
                </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem>on&nbsp;<strong>this</strong>&nbsp;device</DropdownMenuItem>
                    <DropdownMenuItem>on&nbsp;<strong>all</strong>&nbsp;devices</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>

              </nav>

            </SheetContent>
          </Sheet>


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





      {/* TOASTER */}
      <Toaster />

    </main>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
