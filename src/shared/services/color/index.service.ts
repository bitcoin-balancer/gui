import { IColorService, IStateColors } from '@/shared/services/color/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Color Service Factory
 * Generates the object in charge of providing all the colors used by the app to components and
 * services.
 * @returns IColorService
 */
const colorServiceFactory = (): IColorService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // theme colors
  const PRIMARY = '#0C0C0C';
  const PRIMARY_RGB = '12, 12, 12';
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

  // state colors
  const STATELESS = '#64748b';
  const INCREASE_0 = '#14b8a6';
  const INCREASE_1 = '#0f766e';
  const INCREASE_2 = '#134e4a';
  const DECREASE_0 = '#f87171';
  const DECREASE_1 = '#dc2626';
  const DECREASE_2 = '#7f1d1d';
  const STATE: IStateColors = {
    '-2': DECREASE_2,
    '-1': DECREASE_1,
    0: STATELESS,
    1: INCREASE_1,
    2: INCREASE_2,
  };
  const STATE_RGB: IStateColors = {
    '-2': '127, 29, 29',
    '-1': '220, 38, 38',
    0: '100, 116, 139',
    1: '15, 118, 110',
    2: '19, 78, 74',
  };
  const STATE_CLASS_NAME: IStateColors = {
    '-2': 'decrease-2',
    '-1': 'decrease-1',
    0: 'stateless',
    1: 'increase-1',
    2: 'increase-2',
  };
  const STATE_BG_CLASS_NAME: IStateColors = {
    '-2': 'bg-decrease-2',
    '-1': 'bg-decrease-1',
    0: 'bg-stateless',
    1: 'bg-increase-1',
    2: 'bg-increase-2',
  };
  const STATE_TEXT_CLASS_NAME: IStateColors = {
    '-2': 'text-decrease-2',
    '-1': 'text-decrease-1',
    0: 'text-stateless',
    1: 'text-increase-1',
    2: 'text-increase-2',
  };

  /* **********************************************************************************************
   *                                        STATE HELPERS                                         *
   ********************************************************************************************** */

  // ...

  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // theme colors
    PRIMARY,
    PRIMARY_RGB,
    SECONDARY,
    SUCCESS,
    ERROR,
    TEXT,
    LIGHT_TEXT,

    // tailwind palettes
    SLATE,

    // state colors
    STATELESS,
    INCREASE_0,
    INCREASE_1,
    INCREASE_2,
    DECREASE_0,
    DECREASE_1,
    DECREASE_2,
    STATE,
    STATE_RGB,
    STATE_CLASS_NAME,
    STATE_BG_CLASS_NAME,
    STATE_TEXT_CLASS_NAME,

    // ...
  });
};

/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const ColorService = colorServiceFactory();

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { ColorService };
