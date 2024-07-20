import { useState, useEffect } from 'react';
import { MediaQueryService, IBreakpoint } from '../../services/media-query/index.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const useMediaQueryBreakpoint = () => {
  const [breakpoint, setBreakpoint] = useState<IBreakpoint>(
    MediaQueryService.getBreakpoint(window.innerWidth),
  );



  useEffect(() => {
    const listener = () => {
      const current = MediaQueryService.getBreakpoint(window.innerWidth);
      if (current !== breakpoint) {
        setBreakpoint(current);
      }
    };

    window.addEventListener('resize', listener);

    return () => window.removeEventListener('resize', listener);
  }, [breakpoint]);



  return breakpoint;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  useMediaQueryBreakpoint,
};
