import { useSyncExternalStore } from 'react';
import { MediaQueryService } from '../../services/media-query/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Media Query Breakpoint Hook
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
export default useMediaQueryBreakpoint;
