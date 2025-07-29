import { addDays, addHours, addMinutes, subHours, subMinutes, subYears } from 'date-fns';
import { useMemo, useEffect } from 'react';
import { useNavigation, useNavigate, Navigate, Outlet, ScrollRestoration } from 'react-router-dom';
import { House, ArrowLeftRight, Server, SlidersHorizontal, CloudDownload } from 'lucide-react';
import { calculateMean, calculatePercentageChange } from 'bignumber-utils';
import { SWService } from 'sw-service';
import { sendGET } from 'fetch-request-browser';
import { Toaster } from '@/shared/shadcn/components/ui/toaster.tsx';
import { ToastAction } from '@/shared/shadcn/components/ui/toast.tsx';
import { toast } from '@/shared/shadcn/components/ui/use-toast.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { AccessJWTService } from '@/shared/backend/api/access-jwt.service.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { DataJoinService } from '@/shared/backend/data-join/index.service.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { formatBadgeCount } from '@/shared/services/transformers/index.service.ts';
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
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service';
import { IWindowState } from '@/shared/backend/market-state/window/types.ts';
import {
  ISplitStateID,
  ISplitStateItem,
  ISplitStateResult,
  ISplitStates,
  IState,
  IStateResult,
} from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the app essentials will be refetched every APP_ESSENTIALS_REFETCH_FREQUENCY minutes
const APP_ESSENTIALS_REFETCH_FREQUENCY = 2;

// the number of ms that will be used by the updater if there is an available update for the app
const APP_UPDATER_DELAY = Math.floor(SWService.registrationDurationSeconds / 2) * 1000;
const APP_UPDATER_DURATION = 15 * 1000;

/* ************************************************************************************************
 *                                          MOCK HELPERS                                          *
 ************************************************************************************************ */

// the list of split identifiers
const __SPLITS: ISplitStateID[] = ['s100', 's75', 's50', 's25', 's15', 's10', 's5', 's2'];

// the actual values used to generate the splits
const __SPLIT_VALUES: { [key in ISplitStateID]: number } = {
  s100: 1,
  s75: 0.75,
  s50: 0.5,
  s25: 0.25,
  s15: 0.15,
  s10: 0.1,
  s5: 0.05,
  s2: 0.02,
};

/**
 * Applies a split by ID to a series.
 * @param series
 * @param splitID
 * @returns number[] | ISplitStateItem[]
 */
const __applySplit = (
  series: number[] | ISplitStateItem[],
  splitID: ISplitStateID,
): number[] | ISplitStateItem[] =>
  series.slice(series.length - Math.ceil(series.length * __SPLIT_VALUES[splitID]));

/**
 * Extracts the first and last values from a series of numbers or split state items.
 * @param series
 * @returns { first: number, last: number }
 */
const __extractFirstAndLastValues = (
  series: number[] | ISplitStateItem[],
): { first: number; last: number } => {
  const first = series[0];
  const last = series.at(-1)!;
  return {
    first: typeof first === 'number' ? first : first.y,
    last: typeof last === 'number' ? last : last.y,
  };
};

/**
 * Calculates the state based on the percentage change experienced in the window.
 * @param change
 * @param requirement
 * @param strongRequirement
 * @returns IState
 */
const __calculateStateByPercentageChange = (
  change: number,
  requirement: number,
  strongRequirement: number,
): IState => {
  if (change >= strongRequirement) {
    return 2;
  }
  if (change >= requirement) {
    return 1;
  }
  if (change <= -strongRequirement) {
    return -2;
  }
  if (change <= -requirement) {
    return -1;
  }
  return 0;
};

/**
 * Calculates the state for a split based on the percentage change experienced and the requirements.
 * @param series
 * @param requirement
 * @param strongRequirement
 * @returns ISplitStateResult
 */
const calculateSplitState = (
  series: number[] | ISplitStateItem[],
  requirement: number,
  strongRequirement: number,
): ISplitStateResult => {
  // extract the initial and final values
  const { first, last } = __extractFirstAndLastValues(series);

  // calculate the percentage change experienced in the window
  const change = calculatePercentageChange(first, last);

  // finally, return the result
  return {
    state: __calculateStateByPercentageChange(change, requirement, strongRequirement),
    change,
  };
};

/**
 * Calculates the mean for a list of states.
 * @param states
 * @returns IState
 */
const calculateStateMean = (states: IState[]): IState => {
  const mean = calculateMean(states);
  if (mean >= 1.5) {
    return 2;
  }
  if (mean >= 0.75) {
    return 1;
  }
  if (mean <= -1.5) {
    return -2;
  }
  if (mean <= -0.75) {
    return -1;
  }
  return 0;
};

const calculateStateForSeries = (
  series: number[] | ISplitStateItem[],
  requirement: number,
  strongRequirement: number,
): IStateResult => {
  // calculate the state for each split
  const states: ISplitStates = __SPLITS.reduce(
    (prev, current) => ({
      ...prev,
      [current]: calculateSplitState(__applySplit(series, current), requirement, strongRequirement),
    }),
    {} as ISplitStates,
  );

  // finally, return the result
  return {
    mean: calculateStateMean(Object.values(states).map((splitState) => splitState.state)),
    splits: states,
  };
};

/**
 * Transforms raw Binance candlesticks into a compact candlestick records object.
 * @param source
 * @returns ICompactCandlestickRecords
 */
type IBinanceCandlestick = [
  number, // 0 = open time                        e.g. 1638122400000
  string, // 1 = open                             e.g. "53896.36000000"
  string, // 2 = high                             e.g. "54186.17000000"
  string, // 3 = low                              e.g. "53256.64000000"
  string, // 4 = close                            e.g. "54108.99000000"
  string, // 5 = volume                           e.g. "2958.13310000"
  number, // 6 = close time                       e.g. 1638125999999
  string, // 7 = quote asset volume               e.g. "158995079.39633250"
  number, // 8 = number of trades                 e.g. 90424
  string, // 9 = taker buy base asset volume      e.g. "1473.57777000"
  string, // 10 = taker buy quote asset volume    e.g. "79236207.41530900"
  string, // 11 = unused field, ignore
];
const transformCandlesticks = (source: IBinanceCandlestick[]): ICompactCandlestickRecords =>
  source.reduce(
    (prev, current) => {
      prev.id.push(current[0]);
      prev.open.push(Number(current[1]));
      prev.high.push(Number(current[2]));
      prev.low.push(Number(current[3]));
      prev.close.push(Number(current[4]));
      return prev;
    },
    {
      id: [],
      open: [],
      high: [],
      low: [],
      close: [],
    } as ICompactCandlestickRecords,
  );

const calculateWindowState = (source: IBinanceCandlestick[]): IWindowState => {
  const window = transformCandlesticks(source);
  const { mean, splits } = calculateStateForSeries(window.close, 0.025, 0.85);
  return { state: mean, splitStates: splits, window };
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
        badge: typeof unreadAPIErrors === 'number' ? formatBadgeCount(unreadAPIErrors) : '0',
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
        const essentials = await DataJoinService.getAppEssentials();
        // const startTime = subMinutes(addDays(subYears(new Date(), 1), 75), 5);
        const startTime = subHours(new Date(2024, 1, 26), 10);
        console.log(startTime.getTime());
        const { data } = await sendGET(
          `https://data-api.binance.vision/api/v3/klines?symbol=BTCUSDT&interval=15m&limit=128&startTime=${startTime.getTime()}`,
        );
        setAppEssentials({
          ...essentials,
          unreadNotifications: 10,
          unreadAPIErrors: 2,
          marketState: {
            ...essentials.marketState,
            windowState: calculateWindowState(data),
            liquidityState: {
              bidDominance: 81,
            },
            coinsStates: {
              quote: {
                ...essentials.marketState.coinsStates.quote,
                state: 2,
              },
              base: {
                ...essentials.marketState.coinsStates.base,
                state: 1,
              },
            },
          },
          position: {
            id: 'some-id',
            open: Date.now(),
            close: null,
            archived: false,
            entry_price: 51276.45,
            gain: 8.76,
            amount: 0.3839,
            amount_quote: 21409.34,
            amount_quote_in: 0,
            amount_quote_out: 11834.13,
            pnl: 0,
            roi: 0,
          },
        });
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
      // setAppEssentials(compactAppEssentials);
    }
  }, [compactAppEssentials, setAppEssentials]);

  /**
   * App Updater
   * Checks if there is an available update for the app and displays the updater.
   */
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined;
    if (version) {
      if (VersionService.getAvailableUpdates(version) !== null) {
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
      }
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
