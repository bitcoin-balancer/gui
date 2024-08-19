import { IState } from '@/shared/backend/market-state/index.service';
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





  /* **********************************************************************************************
   *                                        STATE HELPERS                                         *
   ********************************************************************************************** */

  /**
   * Retrieves the CSS Background class to be applied to an element based on a state.
   * @param state
   * @returns string
   */
  const getBackgroundClassByState = (state: IState): string => {
    switch (state) {
      case 2:
        return 'bg-increase-2';
      case 1:
        return 'bg-increase-1';
      case -1:
        return 'bg-decrease-1';
      case -2:
        return 'bg-decrease-2';
      default:
        return 'bg-stateless';
    }
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

    // state colors
    STATELESS,
    INCREASE_0,
    INCREASE_1,
    INCREASE_2,
    DECREASE_0,
    DECREASE_1,
    DECREASE_2,
    STATE,

    // state helpers
    getBackgroundClassByState,
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
