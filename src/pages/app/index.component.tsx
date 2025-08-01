import { useMemo, useEffect, useRef } from 'react';
import { useNavigation, useNavigate, Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { House, ArrowLeftRight, Server, SlidersHorizontal, CloudDownload } from 'lucide-react';
import { prettifyBadgeCount } from 'web-utils-kit';
import { SWService } from 'sw-service';
import { Toaster } from '@/shared/shadcn/components/ui/toaster.tsx';
import { ToastAction } from '@/shared/shadcn/components/ui/toast.tsx';
import { toast } from '@/shared/shadcn/components/ui/use-toast.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { AccessJWTService } from '@/shared/backend/api/access-jwt.service.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { DataJoinService } from '@/shared/backend/data-join/index.service.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useSocketEvent } from '@/shared/hooks/socket-event/index.component.ts';
import InfoDialog from '@/shared/components/info-dialog/index.component.tsx';
import LargeInfoDialog from '@/shared/components/large-info-dialog/index.component.tsx';
import ConfirmationDialog from '@/shared/components/confirmation-dialog/index.component.tsx';
import PositionDialog from '@/shared/components/position-dialog/index.component.tsx';
import TransactionDialog from '@/shared/components/transaction-dialog/index.component.tsx';
import GlobalLoader from '@/pages/global-loader/index.component.tsx';
import Header from '@/pages/app/header.component.tsx';
import MobileTabs from '@/pages/app/mobile-tabs.component.tsx';
import OnlineStatus from '@/pages/app/online-status.component.tsx';
import AppInstaller from '@/pages/app/app-installer.component.tsx';
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
   *                                             REFS                                             *
   ********************************************************************************************** */
  const versionTooltipDisplayed = useRef<boolean>(false);

  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const authenticated = useBoundStore((state) => state.authenticated);
  const version = useBoundStore((state) => state.version);
  const unreadAPIErrors = useBoundStore((state) => state.unreadAPIErrors);
  const setAppEssentials = useBoundStore((state) => state.setAppEssentials);
  const isLargeInfoDialogOpen = useBoundStore((state) => state.isLargeInfoDialogOpen);
  const isPositionDialogOpen = useBoundStore((state) => state.isPositionDialogOpen);
  const isTransactionDialogOpen = useBoundStore((state) => state.isTransactionDialogOpen);
  const compactAppEssentials = useSocketEvent('compact_app_essentials');
  const navigation = useNavigation();
  const navigate = useNavigate();

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the active URL
  const { pathname } = window.location;

  // the main navigation buttons located at the top on desktop and at the bottom on mobile devices
  const mainNavigationItems: IMainNavigationItem[] = useMemo(
    () => [
      {
        active: NavService.dashboard() === pathname,
        name: 'Dashboard',
        path: NavService.dashboard(),
        icon: (
          <House
            className="w-5 h-5"
            aria-hidden="true"
          />
        ),
        requirement: 1,
      },
      {
        active: NavService.positions() === pathname,
        name: 'Positions',
        path: NavService.positions(),
        icon: (
          <ArrowLeftRight
            className="w-5 h-5"
            aria-hidden="true"
          />
        ),
        requirement: 2,
      },
      {
        active: NavService.server() === pathname,
        name: 'Server',
        path: NavService.server(),
        icon: (
          <Server
            className="w-5 h-5"
            aria-hidden="true"
          />
        ),
        badge: typeof unreadAPIErrors === 'number' ? prettifyBadgeCount(unreadAPIErrors) : '0',
        requirement: 2,
      },
      {
        active: NavService.adjustments() === pathname,
        name: 'Adjustments',
        path: NavService.adjustments(),
        icon: (
          <SlidersHorizontal
            className="w-5 h-5"
            aria-hidden="true"
          />
        ),
        requirement: 2,
      },
    ],
    [pathname, unreadAPIErrors],
  );

  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Access JWT
   * Checks if the user is currently logged in, in case authentication has not been initialized.
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
      interval = setInterval(
        async () => {
          await __refetchEssentials([5, 15, 25]);
        },
        APP_ESSENTIALS_REFETCH_FREQUENCY * 60 * 1000,
      );
    }
    return () => clearInterval(interval);
  }, [authenticated, setAppEssentials]);

  /**
   * Compact App Essentials
   * Subscribes to the socket event and keeps the local state in sync with the server.
   */
  useEffect(() => {
    if (compactAppEssentials) {
      /* console.log(compactAppEssentials); */
      setAppEssentials(compactAppEssentials);
    }
  }, [compactAppEssentials, setAppEssentials]);

  /**
   * App Updater
   * Checks if there is an available update for the app and displays the updater.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (
      version &&
      VersionService.getAvailableUpdates(version) !== null &&
      !versionTooltipDisplayed.current
    ) {
      timeout = setTimeout(() => {
        toast({
          title: 'Update available',
          description: 'Enjoy the latest innovations, bug fixes, and enhanced security.',
          action: (
            <ToastAction
              altText="Update platform"
              onClick={() => navigate(NavService.platformUpdate())}
            >
              <CloudDownload
                aria-hidden="true"
                className="w-5 h-5"
              />
            </ToastAction>
          ),
          duration: APP_UPDATER_DURATION,
        });
      }, APP_UPDATER_DELAY);
      versionTooltipDisplayed.current = true;
    }
    return () => clearTimeout(timeout);
  }, [version, navigate]);

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (authenticated === false) {
    return <Navigate to={NavService.signIn()} />;
  }
  if (authenticated === undefined || version === undefined) {
    return <GlobalLoader />;
  }
  return (
    <div className="animate-in fade-in duration-700 min-h-dvh">
      {/* **************
       * PROGRESS BAR *
       ************** */}
      {navigation.state === 'loading' && (
        <div className="progress-bar fixed top-0 left-0">
          <div className="progress-bar-value"></div>
        </div>
      )}

      {/* ********
       * HEADER *
       ******** */}
      <Header
        items={mainNavigationItems}
        pathname={pathname}
      />

      {/* ***************
       * ROUTER OUTLET *
       *************** */}
      <main>
        <Outlet />
      </main>

      {/* *************
       * MOBILE TABS *
       ************* */}
      <MobileTabs items={mainNavigationItems} />

      {/* *************
       * INFO DIALOG *
       ************* */}
      <InfoDialog />

      {/* *******************
       * LARGE INFO DIALOG *
       ******************* */}
      {isLargeInfoDialogOpen !== undefined && <LargeInfoDialog data={isLargeInfoDialogOpen} />}

      {/* *********************
       * CONFIRMATION DIALOG *
       ********************* */}
      <ConfirmationDialog />

      {/* *****************
       * POSITION DIALOG *
       ***************** */}
      {isPositionDialogOpen !== undefined && <PositionDialog data={isPositionDialogOpen} />}

      {/* ********************
       * TRANSACTION DIALOG *
       ******************** */}
      {isTransactionDialogOpen !== undefined && (
        <TransactionDialog data={isTransactionDialogOpen} />
      )}

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

      {/* ********************
       * SCROLL RESTORATION *
       ******************** */}
      <ScrollRestoration />
    </div>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default App;
