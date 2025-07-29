/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IComponentProps = {
  // the input's label
  value: string;

  // the content that will be passed to the info-dialog
  description: string | string[];

  // other props
  [key: string]: unknown;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IComponentProps };
