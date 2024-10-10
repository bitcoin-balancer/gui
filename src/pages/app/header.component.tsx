import { memo, useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  CodeXml,
  EarthLock,
  Users,
  CloudDownload,
  ExternalLink,
  Github,
  LogOut,
  Loader2,
  FlaskConical,
  Scale,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
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
import { useBoundStore } from '@/shared/store/index.store.ts';
import { JWTService } from '@/shared/backend/auth/jwt/index.service.ts';
import { VersionService } from '@/shared/backend/version/index.service';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import SocketIOStatus from '@/pages/app/socket-io-status.component.tsx';
import NotificationsButton from '@/pages/app/notifications-button.component.tsx';
import { IMainNavigationItem } from '@/pages/app/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Header Component
 * Component in charge of providing the top and side navigation systems.
 */
const Header = memo(({ items, pathname }: { items: IMainNavigationItem[], pathname: string }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const openLargeInfoDialog = useBoundStore((state) => state.openLargeInfoDialog);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const version = useBoundStore((state) => state.version!);
  const { authority } = useBoundStore((state) => state.user!);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // available service updates
  const availableUpdates = useMemo(() => VersionService.getAvailableUpdates(version), [version]);

  // info regarding the running version
  const lastCommit = useMemo(
    () => VersionService.buildLastCommitText(version.gui.latest),
    [version.gui.latest],
  );





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
  return (
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
      {items.map((item, i) => (
        <Tooltip key={i}>
          <TooltipTrigger asChild>
            <Button
              variant='ghost'
              className='hidden md:flex lg:hidden relative'
              aria-label={item.name}
              onClick={() => navigate(item.path)}
              disabled={item.active || item.requirement > authority}
            >
              {item.icon}
              {
                item.badge
                && <div
                  className={`absolute -top-2 ${item.badge === '9+' ? '-right-3' : '-right-2'}`}
                >
                  <Badge
                    className='py-0.5 px-1.5'
                  >{item.badge}</Badge>
                </div>
              }
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{item.name}</p>
          </TooltipContent>
        </Tooltip>
      ))}



      {/* **************
        * LG BUTTONS *
        ************** */}
      {items.map((item, i) => (
        <Button
          key={i}
          variant='ghost'
          className='hidden lg:flex relative'
          onClick={() => navigate(item.path)}
          disabled={item.active || item.requirement > authority}
        >
          {item.icon} <span className='ml-2'>{item.name}</span>
          {
            item.badge
            && <div
              className={`absolute -top-2 ${item.badge === '9+' ? '-right-3' : '-right-2'}`}
            >
              <Badge
                className='py-0.5 px-1.5'
              >{item.badge}</Badge>
            </div>
          }
        </Button>
      ))}


      {/* ***************
        * NOTIFICATIONS *
        *************** */}
      <NotificationsButton size={breakpoint === 'xs' || breakpoint === 'sm' ? 'icon' : 'default'} />



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
              aria-label='Side Navigation Menu'
              size={breakpoint === 'xs' || breakpoint === 'sm' ? 'icon' : 'default'}
            ><Menu className='w-5 h-5' aria-hidden='true' /></Button>
          </div>
        </SheetTrigger>

        <SheetContent
          className='w-64 sm:72 md-80 lg:96 p-4 overflow-y-auto'
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
              asChild
            >
              {
                availableUpdates === null
                  ? <a
                      href={NavService.buildGUICommitURL(version.gui.latest.sha)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex justify-start items-center text-light'
                      style={{ marginTop: 3 }}
                    >
                      <CodeXml
                          className='mr-1 w-4 h-4'
                      />
                      <p
                        className='truncate max-w-[85%] text-sm'
                      >{lastCommit}</p>
                    </a>
                  : <Button
                      variant='link'
                      className='justify-start p-0 min-h-0 text-light text-sm'
                      onClick={() => navigateFromSidenav(NavService.platformUpdate())}
                      style={{ marginTop: '-3px' }}
                    >
                      <CodeXml
                        className='mr-1 w-4 h-4'
                      />
                      <p className='truncate max-w-[85%]'>Update available</p>
                    </Button>
              }
            </SheetDescription>
          </SheetHeader>

          <nav className='mt-4'>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromSidenav(NavService.ipBlacklist())}
              disabled={pathname === NavService.ipBlacklist() || authority < 2}
            >
              <EarthLock
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> IP address blacklist
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromSidenav(NavService.users())}
              disabled={pathname === NavService.users() || authority < 5}
            >
              <Users
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Users
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromSidenav(NavService.platformUpdate())}
              disabled={pathname === NavService.platformUpdate()}
            >
              <CloudDownload
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Platform update
              <span className='flex-1'></span>
              {
                availableUpdates !== null
                && <Badge
                  className='text-xs py-0.5 px-1.5'
                >{availableUpdates === 'BOTH' ? 2 : 1}</Badge>
              }
            </Button>

            <Separator className='my-4' />

            <SocketIOStatus />

            <Separator className='my-4' />

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={NavService.createNewInstance}
            >
              <ExternalLink
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Create new instance
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={() => navigateFromSidenav(NavService.landing())}
              disabled={pathname === NavService.landing()}
            >
              <FlaskConical
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> About the project
            </Button>

            <Button
              variant='ghost'
              className='w-full justify-start'
              onClick={NavService.openGitHubPage}
            >
              <Github
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> View on GitHub
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

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant='ghost'
                  className='w-full justify-start'
                  disabled={isSigningOut}
                >
                  <LogOut
                    aria-hidden='true'
                    className='w-5 h-5 mr-2'
                  /> Sign out
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
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Header;
