import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { decodeError } from 'error-message-utils';
import { Input } from '../../../../shared/shadcn/components/ui/input.tsx';
import { Textarea } from '../../../../shared/shadcn/components/ui/textarea.tsx';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../../../../shared/shadcn/components/ui/form.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../../../shared/shadcn/components/ui/dialog.tsx';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { errorToast } from '../../../../shared/services/utils/index.service.ts';
import { formatDate } from '../../../../shared/services/transformations/index.service.ts';
import { ipNotesValid, ipValid } from '../../../../shared/backend/validations/index.service.ts';
import { IPBlacklistService } from '../../../../shared/backend/ip-blacklist/index.service.ts';
import { useBoundStore } from '../../../../shared/store/index.store.ts';
import { IAPIErrorDialogProps } from './types.ts';
import { formatRelative } from 'date-fns';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Error Dialog Component
 * Component in charge of ...
 */
const APIErrorDialog = ({ open, onOpenChange }: IAPIErrorDialogProps) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // decoded error
  const { message, code } = useMemo(() => decodeError(open?.error), [open]);


  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  // @TODO
  const download = (): void => {

  };




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog open={open !== false} onOpenChange={() => onOpenChange(false)}>

      <DialogContent className='max-h-dvh overflow-y-auto overflow-x-hidden'>

        <DialogHeader>
          <DialogTitle>API Error</DialogTitle>
          <DialogDescription>
            This error was thrown in the API {open ? formatRelative(open.event_time, Date.now()) : ''}
          </DialogDescription>
        </DialogHeader>

        
      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APIErrorDialog;
