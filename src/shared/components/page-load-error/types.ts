

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the props that can be passed to customize the error component
type IComponentProps = {
  // the kind of error box that will be displayed
  variant?: 'page' | 'dialog';

  // the error that was thrown when retrieving the data
  error: unknown;
};




/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
