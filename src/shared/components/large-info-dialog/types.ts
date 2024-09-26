


/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the list of sections supported by the large info dialog
type ISectionID = 'value_averaging' | 'window' | 'liquidity' | 'coins' | 'reversal' | 'strategy' | 'terms';

// details about each section
type ISection = {
  title: string;
  description: string;
};
type ISections = {
  [id in ISectionID]: ISection;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  ISectionID,
  ISections,
};
