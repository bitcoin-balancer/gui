import { PropsWithChildren } from 'react';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * Component in charge of displaying a piece of code/command.
 */
type IComponentProps = PropsWithChildren<{
  className?: string;
}>;





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
