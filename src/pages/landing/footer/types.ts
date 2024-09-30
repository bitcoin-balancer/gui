import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';
import { ISectionID as ILandingSectionID } from '@/pages/landing/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// props used by the component
type IFooterProps = {
  openLargeInfoDialog: (data: ISectionID) => void,
  navigateToSection: (id: ILandingSectionID) => void,
  navigate: (path: string) => void,
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IFooterProps,
};
