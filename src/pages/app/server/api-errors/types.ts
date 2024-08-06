import { IAPIError } from '@/shared/backend/api-error/index.service.ts';

/* ************************************************************************************************
 *                                           API ERROR                                            *
 ************************************************************************************************ */
type IAPIErrorProps = {
  id: string,
  data: IAPIError,
  openDialog: () => void,
};





/* ************************************************************************************************
 *                                        API ERROR DIALOG                                        *
 ************************************************************************************************ */

type IAPIErrorDialogProps = {
  open: boolean;
  onOpenChange: (value: boolean) => void;
  record: IAPIError
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
