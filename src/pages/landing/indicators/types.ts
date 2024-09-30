import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';


/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// props used by an individual indicator
type IIndicatorProps = {
  title: string;
  description: string;
  openDialog: () => void;
};


// props used by the component
type IIndicatorsProps = {
  openLargeInfoDialog: (data: ISectionID) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IIndicatorProps,
  IIndicatorsProps,
};
