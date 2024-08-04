import { IAPIError } from '../../../../shared/backend/api-error/index.service.ts';

/* ************************************************************************************************
 *                                           API ERROR                                            *
 ************************************************************************************************ */

type IAPIErrorProps = {
  id: string,
  data: IAPIError,
  setActiveDialog: (value: IAPIError | null | false) => void,
};





/* ************************************************************************************************
 *                                        API ERROR DIALOG                                        *
 ************************************************************************************************ */

type IAPIErrorDialogProps = {
  open: IAPIError | null | false,
  onOpenChange: (value: boolean) => void,
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
