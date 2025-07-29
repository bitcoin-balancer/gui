/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the loader's variant based on where it is located
type IVariant = 'page' | 'dialog';

// the props that will be passed to the component
type IComponentProps = {
  variant?: IVariant;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IVariant, IComponentProps };
