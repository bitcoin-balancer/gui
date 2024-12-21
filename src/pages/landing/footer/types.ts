import { ISectionID } from '@/shared/components/large-info-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// props used by the component
type IFooterProps = {
  openUnderConstructionDialog: () => void;
  openContactDialog: () => void,
  openLargeInfoDialog: (data: ISectionID) => void,
  navigate: (path: string) => void,
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IFooterProps,
};
