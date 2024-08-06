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
  ExternalLink,
  Github,
  LogOut,
  Loader2,
  CloudDownload,
} from 'lucide-react';
import { SWService } from 'sw-service';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { Toaster } from '@/shared/shadcn/components/ui/toaster';
import { ToastAction } from '@/shared/shadcn/components/ui/toast';
import { toast } from '@/shared/shadcn/components/ui/use-toast.ts';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { ENVIRONMENT } from '@/environment/environment.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { formatBadgeCount } from '@/shared/services/transformations/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { AccessJWTService } from '@/shared/backend/api/access-jwt.service.ts';
import { JWTService } from '@/shared/backend/auth/jwt/index.service.ts';
import { DataJoinService } from '@/shared/backend/data-join/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import AppInstaller from '@/shared/components/app-installer/index.component.tsx';
import OnlineStatus from '@/shared/components/online-status/index.component.tsx';
import ConfirmationDialog from '@/shared/components/confirmation-dialog/index.component.tsx';
import GlobalLoader from '@/pages/global-loader/index.component.tsx';
import BottomNavigation from '@/pages/app/bottom-navigation.component';
import { IMainNavigationItem } from '@/pages/app/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the app essentials will be refetched every APP_ESSENTIALS_REFETCH_FREQUENCY minutes
const APP_ESSENTIALS_REFETCH_FREQUENCY = 2;

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
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const authenticated = useBoundStore((state) => state.authenticated);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const version = useBoundStore((state) => state.version);
  const unreadAPIErrors = useBoundStore((state) => state.unreadAPIErrors);
  const setAppEssentials = useBoundStore((state) => state.setAppEssentials);
  const navigate = useNavigate();
  const navigation = useNavigation();
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);





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
        badge: typeof unreadAPIErrors === 'number' ? formatBadgeCount(unreadAPIErrors) : '0',
      },
      {
        active: NavService.adjustments() === pathname,
        name: 'Adjustments',
        path: NavService.adjustments(),
        icon: <SlidersHorizontal aria-hidden='true' />,
      },
    ]),
    [pathname, unreadAPIErrors],
  );





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in in case authentication has not been initialized.
   */
  useEffect(() => {
    const loadAuthState = async () => {
      try {
        await AccessJWTService.accessJWTChanged(null);
      } catch (e) {
        errorToast(e);
      }
    };
    if (authenticated === undefined) {
      loadAuthState();
    }
  }, [authenticated]);

  /**
   * App Essentials
   * If the user is authenticated it fetches the app essentials and keeps doing so.
   */
  useEffect(() => {
    // fetches the app essentials persistently
    const __refetchEssentials = async (retryDelaySchedule: number[]): Promise<void> => {
      try {
        setAppEssentials(await DataJoinService.getAppEssentials());
        console.log('Refetched App Essentials');
        return undefined;
      } catch (e) {
        if (!retryDelaySchedule.length) {
          throw e;
        }
        return __refetchEssentials(retryDelaySchedule.slice(1));
      }
    };

    // initializes the interval that will keep the essentials synced with the server
    let interval: NodeJS.Timeout | undefined;
    if (authenticated) {
      __refetchEssentials([5, 15, 25]);
      interval = setInterval(async () => {
        await __refetchEssentials([5, 15, 25]);
      }, (APP_ESSENTIALS_REFETCH_FREQUENCY * 60) * 1000);
    }
    return () => clearInterval(interval);
  }, [authenticated, setAppEssentials]);

  /**
   * App Updater
   * Checks if there is an available update for the app and displays the updater.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (version) {
      if (ENVIRONMENT.version !== version.gui.latest.version) {
        timeout = setTimeout(() => {
          toast({
            title: `Update to v${version.gui.latest.version}`,
            description: 'Enjoy the latest innovations, bug fixes, and enhanced security.',
            action: <ToastAction altText='Update Application' onClick={SWService.updateApp}><CloudDownload aria-hidden='true' /></ToastAction>,
            duration: APP_UPDATER_DURATION,
          });
        }, APP_UPDATER_DELAY);
      }
    }
    return () => clearTimeout(timeout);
  }, [version]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Navigates to a route and closes the sidenav menu.
   * @param route
   */
  const navigateFromSidenav = (route: string): void => {
    setSidenavOpen(false);
    navigate(route);
  };

  /**
   * Prompts the user and if confirmed, it will destroy the current session.
   * @param allDevices
   */
  const signOut = (allDevices: boolean): void => {
    openConfirmationDialog({
      mode: 'CLICK',
      title: 'Sign out',
      description: `Signing out will log you off from ${allDevices ? 'all your devices' : 'this device'}. Continue?`,
      onConfirmation: async () => {
        try {
          setIsSigningOut(true);
          await JWTService.signOut(allDevices);
        } catch (e) {
          errorToast(e, 'Authentication Error');
        } finally {
          setIsSigningOut(false);
        }
      },
    });
  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated === false) {
    return <Navigate to={NavService.signIn()} />;
  }
  if (authenticated === undefined || unreadAPIErrors === undefined || version === undefined) {
    return <GlobalLoader />;
  }
  return (
    <div
      className='animate-in fade-in duration-700 min-h-dvh'
    >

      {/* **************
        * PROGRESS BAR *
        ************** */}
      {
        navigation.state === 'loading'
        && <div
          className='progress-bar fixed top-0 left-0'
        ><div className='progress-bar-value'></div></div>
      }



      {/* ************
        * NAV HEADER *
        ************ */}
      <nav
        id='app-header'
        className='flex justify-center items-center border-b border-slate-200 gap-3 md:gap-5'
      >

        <Link
          to={NavService.landing()}
        >
          <img
            src='/logo/logo-dark.png'
            alt='Balancer’s Logo'
            width='176'
            height='60'
            className='w-32 lg:w-36'
          />
        </Link>

        <span className='flex-1'></span>



        {/* ****************
          * TOP NAVIGATION *
          **************** */}

        {/* ************
          * MD BUTTONS *
          ************ */}
        {mainNavigationItems.map((item, i) => (
          <Tooltip key={i}>
            <TooltipTrigger asChild>
              {
                item.badge
                  ? <Button
                    variant='ghost'
                    className='hidden md:flex lg:hidden relative'
                    aria-label={item.name}
                    onClick={() => navigate(item.path)}
                    disabled={item.active}
                  >
                    {item.icon}
                    <div
                      className='absolute -top-2 -right-3'
                    >
                      <Badge
                        className='py-0.5 px-1.5'
                      >{item.badge}</Badge>
                    </div>
                  </Button>
                  : <Button
                    variant='ghost'
                    className='hidden md:flex lg:hidden'
                    aria-label={item.name}
                    onClick={() => navigate(item.path)}
                    disabled={item.active}
                  >
                    {item.icon}
                  </Button>
              }
            </TooltipTrigger>
            <TooltipContent>
              <p>{item.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}



        {/* **************
          * LG BUTTONS *
          ************** */}
        {mainNavigationItems.map((item, i) => (item.badge
          ? <Button
            key={i}
            variant='ghost'
            className='hidden
            lg:flex relative'
            onClick={() => navigate(item.path)} disabled={item.active}
          >
            {item.icon} <span className='ml-2'>{item.name}</span>
            <div
              className='absolute -top-2 -right-2'
            >
              <Badge
                className='py-0.5 px-1.5'
              >{item.badge}</Badge>
            </div>
          </Button>
          : <Button
            key={i}
            variant='ghost'
            className='hidden lg:flex'
            onClick={() => navigate(item.path)}
            disabled={item.active}
          >
            {item.icon} <span className='ml-2'>{item.name}</span>
          </Button>
        ))}



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
                variant='ghost'
                className='hidden md:flex'
                aria-label='Side Navigation Menu'
              ><Menu aria-hidden='true' /></Button>
              <Button
                variant='ghost'
                className='md:hidden'
                size='icon'
                aria-label='Side Navigation Menu'
              ><Menu aria-hidden='true' /></Button>
            </div>
          </SheetTrigger>

          <SheetContent
            className='w-64 sm:72 md-80 lg:96 p-4'
          >
            <SheetHeader>
              <SheetTitle
                className='flex justify-start items-center'
              >
                <img
                  src='/logo/logo-dark.png'
                  alt='Balancer’s Logo'
                  width='80'
                  height='30'
                  className='w-20'
                />
                <Badge
                  variant='secondary'
                  className='ml-2'
                >GUI</Badge>
              </SheetTitle>

              <SheetDescription
                className='text-left'
              >
                <Button
                  variant='link'
                  className='justify-start p-0 -mt-6 text-light text-xs'
                  onClick={NavService.openGitHubPage}
                >
                  <CodeXml
                    className='mr-1 w-4 h-4'
                  />v1.0.0 · 0a23ed6 · last month
                </Button>
              </SheetDescription>
            </SheetHeader>

            <nav className='mt-4'>

              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={() => navigateFromSidenav(NavService.ipBlacklist())}
                disabled={pathname === NavService.ipBlacklist()}
              ><EarthLock /> <span className='ml-2'>IP address blacklist</span></Button>
              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={() => navigateFromSidenav(NavService.users())}
                disabled={pathname === NavService.users()}
              ><Users /> <span className='ml-2'>Users</span></Button>

              <Separator className='my-4' />

              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={NavService.createNewInstance}
              ><ExternalLink /> <span className='ml-2'>Create new instance</span></Button>
              <Button
                variant='ghost'
                className='w-full justify-start'
                onClick={NavService.openGitHubPage}
              ><Github /> <span className='ml-2'>View on GitHub</span></Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  disabled={isSigningOut}
                >
                  <LogOut /> <span className='ml-2'>Sign out</span>
                  <span className='flex-1'></span>
                  {
                    isSigningOut
                    && <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                  }
              </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => signOut(false)}>
                    on&nbsp;<strong>this</strong>&nbsp;device
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => signOut(true)}>
                    on&nbsp;<strong>all</strong>&nbsp;devices
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

            </nav>

          </SheetContent>

        </Sheet>

      </nav>





      {/* ***************
        * ROUTER OUTLET *
        *************** */}
      <main>
        <Outlet />
      </main>




      {/* *******************
        * BOTTOM NAVIGATION *
        ******************* */}
      <BottomNavigation items={mainNavigationItems} />





      {/* *********************
        * CONFIRMATION DIALOG *
        ********************* */}
      <ConfirmationDialog />



      {/* ***************
        * ONLINE STATUS *
        *************** */}
      <OnlineStatus />



      {/* ***************
        * APP INSTALLER *
        *************** */}
      <AppInstaller />



      {/* *********
        * TOASTER *
        ********* */}
      <Toaster />

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
