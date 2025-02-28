

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * CodeSnippet Props
 * Component in charge of displaying code or command snippets.
 */
type IComponentProps = {
  code: string;
  isCommand?: boolean;
  canBeCopied?: boolean;
  className?: string;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IComponentProps,
};
