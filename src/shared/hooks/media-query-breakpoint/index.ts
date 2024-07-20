import { useSyncExternalStore } from 'react';
import { MediaQueryService } from '../../services/media-query/index.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Media Query Breakpoint
 * Subscribes to the active breakpoint based on the Client's screen width.
 */
const useMediaQueryBreakpoint = () => useSyncExternalStore(
  (callback) => {
    window.addEventListener('resize', callback);
    return () => window.removeEventListener('resize', callback);
  },
  () => MediaQueryService.getBreakpoint(window.innerWidth),
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useMediaQueryBreakpoint,
};
