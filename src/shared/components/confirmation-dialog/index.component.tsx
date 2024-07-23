import { useState } from 'react';
import { Clipboard } from 'lucide-react';
import { extractMessage } from 'error-message-utils';
import { Button } from '../../shadcn/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../../shadcn/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../../shadcn/components/ui/input-otp';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '../../shadcn/components/ui/tooltip';
import { useToast } from '../../shadcn/components/ui/use-toast';
import { useBoundStore } from '../../store/index.store.ts';
import { otpTokenValid } from '../../backend/validations/index.service.ts';
import { ClipboardService } from '@/shared/services/clipboard/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Confirmation Dialog
 * Component in charge of handling the confirmation of an action for any of the supported modes.
 */
const ConfirmationDialog = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [otpToken, setOTPToken] = useState<string>('');
  const [readingClipboard, setReadingClipboard] = useState<boolean>(false);
  const { toast } = useToast();
  const isOpen = useBoundStore((state) => state.isConfirmationDialogOpen);
  const config = useBoundStore((state) => state.confirmationDialogConfig);
  const close = useBoundStore((state) => state.closeConfirmationDialog);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Closes the dialog and resets its state when the action is confirmed or cancelled.
   * @param confirmed?
   */
  const closeDialog = (confirmed?: unknown) => {
    if (config?.mode === 'BUTTON_CLICK' && confirmed === true) {
      config.onConfirmation('');
    }
    if (config?.mode === 'OTP' && otpTokenValid(confirmed)) {
      config.onConfirmation(confirmed);
    }
    close();
    setOTPToken('');
  };

  /**
   * Triggers whenever the OTP Token changes. If it is a valid token, it confirms the action
   * automatically.
   * @param value
   */
  const onOTPTokenChanges = (value: string) => {
    setOTPToken(value);
    if (otpTokenValid(value)) {
      closeDialog(value);
    }
  };

  /**
   * Attempts to read the OTP Token from the system's clipboard. If it is a valid OTP Token, it
   * puts it through the handler right away. Otherwise, it displays the error and aborts.
   */
  const pasteOTPToken = async () => {
    try {
      setReadingClipboard(true);
      const val = await ClipboardService.readText();
      if (!otpTokenValid(val)) {
        throw new Error(`The text extracted from the system's clipboard is not a valid OTP Token. Received: '${val}'`);
      }
      onOTPTokenChanges(val);
    } catch (e) {
      toast({
        variant: 'destructive',
        title: 'Clipboard Error',
        description: extractMessage(e),
      });
    } finally {
      setReadingClipboard(false);
    }
  };





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog open={isOpen} onOpenChange={closeDialog}>

      <DialogContent className="sm:max-w-[425px]">

        {/* DIALOG HEADER */}
        <DialogHeader>

          <DialogTitle>{config?.title || 'Confirm Action'}</DialogTitle>
          {config?.subTitle && <DialogDescription>{config.subTitle}</DialogDescription>}

        </DialogHeader>



        {/* DIALOG CONTENT */}
        {/* @TODO */}



        {/* OTP TOKEN INPUT */}
        {
          config?.mode === 'OTP'
          && <>
            <div className='flex justify-center items-center mt-5'>

            <InputOTP maxLength={6} value={otpToken} onChange={onOTPTokenChanges}>
              <InputOTPGroup>
                <InputOTPSlot index={0} className='shadow-md ring-1 ring-slate-200' />
                <InputOTPSlot index={1} className='shadow-md ring-1 ring-slate-200' />
                <InputOTPSlot index={2} className='shadow-md ring-1 ring-slate-200' />
              </InputOTPGroup>
              <InputOTPSeparator />
              <InputOTPGroup>
                <InputOTPSlot index={3} className='shadow-md ring-1 ring-slate-200' />
                <InputOTPSlot index={4} className='shadow-md ring-1 ring-slate-200' />
                <InputOTPSlot index={5} className='shadow-md ring-1 ring-slate-200' />
              </InputOTPGroup>
            </InputOTP>

            </div>

            <p className='text-light text-center text-xs'>Enter your one-time password</p>
          </>
        }



        {/* DIALOG FOOTER */}
        <DialogFooter className='flex mt-5'>

          <Button type='button' variant='ghost' onClick={closeDialog} className='mt-3 sm:mt-0 text-warn'>CANCEL</Button>

          <span className='flex-1'></span>

          {(config?.mode === 'OTP' && ClipboardService.isSupported) && <Button type='button' onClick={pasteOTPToken} disabled={readingClipboard} variant='outline' className='sm:hidden mt-3' aria-label='Click this button to paste the OTP Token from the clipboard'>PASTE</Button>}

          {
            (config?.mode === 'OTP' && ClipboardService.isSupported)
            && <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button type='button' onClick={pasteOTPToken} disabled={readingClipboard} variant="outline" size="icon" className='hidden sm:flex' aria-label='Click this button to paste the OTP Token from the clipboard'><Clipboard className="h-4 w-4" aria-hidden='true' /></Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste the one-time password</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          }

          <Button type='submit' onClick={() => closeDialog(true)} disabled={config?.mode === 'OTP'} className='bg-primary'>CONFIRM</Button>

        </DialogFooter>

      </DialogContent>

    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ConfirmationDialog;
