import { IColorService } from '@/shared/services/color/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Color Service Factory
 * Generates the object in charge of providing all the colors used by the app to components and
 * services.
 * @returns ISomeService
 */
const colorServiceFactory = (): IColorService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // theme colors
  const PRIMARY = '#0C0C0C';
  const SECONDARY = '#1d1c1c';
  const SUCCESS = '#1B5E20';
  const ERROR = '#B71C1C';
  const TEXT = '#0f172a';
  const LIGHT_TEXT = '#64748b';

  // tailwind palettes
  const SLATE = {
    H50: '#f8fafc',
    H100: '#f1f5f9',
    H200: '#e2e8f0',
    H300: '#cbd5e1',
    H400: '#94a3b8',
    H500: '#64748b',
    H600: '#475569',
    H700: '#334155',
    H800: '#1e293b',
    H900: '#0f172a',
    H950: '#020617',
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // theme colors
    PRIMARY,
    SECONDARY,
    SUCCESS,
    ERROR,
    TEXT,
    LIGHT_TEXT,

    // tailwind palettes
    SLATE,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ColorService = colorServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ColorService,
};
