import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';
import { ISectionID as ILandingSectionID } from '@/pages/landing/types.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// props used by the component
type IFeaturesProps = {
  breakpoint: IBreakpoint
  openLargeInfoDialog: (data: ISectionID) => void,
  navigateToSection: (id: ILandingSectionID) => void,
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IFeaturesProps,
};
