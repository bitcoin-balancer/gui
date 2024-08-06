import { memo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Menu,
  CodeXml,
  EarthLock,
  Users,
  ExternalLink,
  Github,
  LogOut,
  Loader2,
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
import { JWTService } from '@/shared/backend/auth/jwt/index.service.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
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
  const [sidenavOpen, setSidenavOpen] = useState<boolean>(false);
  const navigate = useNavigate();
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const [isSigningOut, setIsSigningOut] = useState<boolean>(false);





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
      {items.map((item, i) => (item.badge
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
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Header;
