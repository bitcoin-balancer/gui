import { IAPIError } from '@/shared/backend/api-error/index.service.ts';

/* ************************************************************************************************
 *                                           API ERROR                                            *
 ************************************************************************************************ */
type IAPIErrorProps = {
  id: string;
  data: IAPIError;
  openDialog: (record: IAPIError) => void;
  isUnread: boolean;
};





/* ************************************************************************************************
 *                                        API ERROR DIALOG                                        *
 ************************************************************************************************ */

type IAPIErrorDialogProps = {
  record: IAPIError;
  closeDialog: (nextState: undefined) => void;
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
