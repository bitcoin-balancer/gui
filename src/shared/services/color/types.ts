import { IState } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Color Service
 * Object in charge of providing all the colors used by the app to components and services.
 */
type IColorService = {
  // theme colors
  PRIMARY: string;
  PRIMARY_RGB: string;
  SECONDARY: string;
  SUCCESS: string;
  ERROR: string;
  TEXT: string;
  LIGHT_TEXT: string;

  // tailwind palettes
  SLATE: ITailwindPalette;

  // state colors
  STATELESS: string;
  INCREASE_0: string;
  INCREASE_1: string;
  INCREASE_2: string;
  DECREASE_0: string;
  DECREASE_1: string;
  DECREASE_2: string;
  STATE: IStateColors;
  STATE_RGB: IStateColors;
  STATE_CLASS_NAME: IStateColors;
  STATE_BG_CLASS_NAME: IStateColors;
  STATE_TEXT_CLASS_NAME: IStateColors;

  // ...
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// tailwind color palette
type ITailwindPaletteHue = 'H50' | 'H100' | 'H200' | 'H300' | 'H400' | 'H500' | 'H600' | 'H700'
| 'H800' | 'H900' | 'H950';
type ITailwindPalette = {
  [key in ITailwindPaletteHue]: string;
};

// each state has its own color based on the intensity
type IStateColors = {
  [key in IState]: string;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IColorService,

  // types
  ITailwindPaletteHue,
  ITailwindPalette,
  IStateColors,
};
