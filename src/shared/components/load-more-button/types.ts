/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// component props
type IComponentProps = {
  // the message to display on the button
  message?: string;

  // the list of class names to append to the button
  className?: string;

  // the function to start the loading process
  loadMore: () => void | Promise<void>;
  loadingMore: boolean;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IComponentProps };
