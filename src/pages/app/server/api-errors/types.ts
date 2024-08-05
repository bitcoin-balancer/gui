import { IAPIError } from '../../../../shared/backend/api-error/index.service.ts';

/* ************************************************************************************************
 *                                           API ERROR                                            *
 ************************************************************************************************ */

type IAPIErrorProps = {
  id: string,
  data: IAPIError,
  setActiveDialog: (value: IAPIError) => void,
};





/* ************************************************************************************************
 *                                        API ERROR DIALOG                                        *
 ************************************************************************************************ */

type IAPIErrorDialogProps = {
  open: boolean;
  record: IAPIError;
  onOpenChange: (value: boolean) => void;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // api error component
  IAPIErrorProps,

  // api error dialog component
  IAPIErrorDialogProps,
};
