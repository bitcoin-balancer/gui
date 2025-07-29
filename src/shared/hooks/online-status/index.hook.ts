import { useSyncExternalStore } from 'react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Online Status Hook
 * Subscribes to the Client's Internet Connection Status.
 * @returns () => boolean
 */
const useOnlineStatus: () => boolean = () =>
  useSyncExternalStore(
    (callback) => {
      window.addEventListener('online', callback);
      window.addEventListener('offline', callback);
      return () => {
        window.removeEventListener('online', callback);
        window.removeEventListener('offline', callback);
      };
    },
    () => navigator.onLine,
  );

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { useOnlineStatus };
