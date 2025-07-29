/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Media Query Service
 * Object in charge of providing utility functions to manage responsive media queries easily.
 */
type IMediaQueryService = {
  // properties
  // ...

  // actions
  getBreakpoint: (screenWidth: number) => IBreakpoint;
};

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Breakpoint
 * The utility breakpoints provided by Tailwind CSS for responsive design inspired the mobile-first
 * breakpoint system approach. More info:
 * https://tailwindcss.com/docs/responsive-design
 *
 * Resolutions:
 * - xs:  min-width: 0px
 * - sm:  min-width: 640px
 * - md:  min-width: 768px
 * - lg:  min-width: 1024px
 * - xl:  min-width: 1280px
 * - 2xl: min-width: 1536px
 */
type IBreakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IMediaQueryService,

  // types
  IBreakpoint,
};
