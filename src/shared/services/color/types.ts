

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
  SECONDARY: string;
  SUCCESS: string;
  ERROR: string;
  TEXT: string;
  LIGHT_TEXT: string;

  // tailwind palettes
  SLATE: ITailwindPalette;
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





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IColorService,

  // types
  ITailwindPaletteHue,
  ITailwindPalette,
};
