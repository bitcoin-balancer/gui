import { useState } from 'react';
import { Clipboard } from 'lucide-react';
import { isOTPTokenValid } from 'web-utils-kit';
import { ClipboardService } from 'clipboard-service';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '@/shared/shadcn/components/ui/input-otp.tsx';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/shared/shadcn/components/ui/tooltip.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Confirmation Dialog Component
 * Component in charge of handling the confirmation of an action for any of the supported modes.
 */
const ConfirmationDialog = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [otpToken, setOTPToken] = useState<string>('');
  const [readingClipboard, setReadingClipboard] = useState<boolean>(false);
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
    if (config?.mode === 'CLICK' && confirmed === true) {
      config.onConfirmation('');
    }
    if (config?.mode === 'OTP' && isOTPTokenValid(confirmed)) {
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
    if (isOTPTokenValid(value)) {
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
      if (!isOTPTokenValid(val)) {
        throw new Error(
          `The text extracted from the system's clipboard is not a valid OTP Token. Received: '${val}'`,
        );
      }
      onOTPTokenChanges(val);
    } catch (e) {
      errorToast(e, 'Clipboard Error');
    } finally {
      setReadingClipboard(false);
    }
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog
      open={isOpen}
      onOpenChange={closeDialog}
    >
      <DialogContent>
        {/* ***************
         * DIALOG HEADER *
         *************** */}
        <DialogHeader>
          <DialogTitle>{config?.title || 'Confirm Action'}</DialogTitle>
          <DialogDescription>{config?.description}</DialogDescription>
        </DialogHeader>

        {/* ****************
         * DIALOG CONTENT *
         **************** */}
        {/* @TODO */}

        {/* *****************
         * OTP TOKEN INPUT *
         ***************** */}
        {config?.mode === 'OTP' && (
          <>
            <div className="flex justify-center items-center mt-5">
              <InputOTP
                id="otp-confirmation"
                maxLength={6}
                value={otpToken}
                onChange={onOTPTokenChanges}
                aria-label="One-time password input"
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <p className="text-light text-center text-xs">Enter your one-time password</p>
          </>
        )}

        {/* ***************
         * DIALOG FOOTER *
         *************** */}
        <DialogFooter className="flex mt-5">
          <Button
            type="button"
            variant="ghost"
            onClick={closeDialog}
            className="mt-3 sm:mt-0"
          >
            Cancel
          </Button>

          <span className="flex-1"></span>

          {config?.mode === 'OTP' && ClipboardService.isSupported && (
            <Button
              type="button"
              onClick={pasteOTPToken}
              disabled={readingClipboard}
              variant="outline"
              className="sm:hidden mt-3"
              aria-label="Paste the one-time password from the system’s clipboard"
            >
              Paste
            </Button>
          )}

          {config?.mode === 'OTP' && ClipboardService.isSupported && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    type="button"
                    onClick={pasteOTPToken}
                    disabled={readingClipboard}
                    variant="outline"
                    size="icon"
                    className="hidden sm:flex"
                    aria-label="Paste the one-time password from the system’s clipboard"
                  >
                    <Clipboard
                      className="h-4 w-4"
                      aria-hidden="true"
                    />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Paste the one-time password from the system’s clipboard</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}

          <Button
            type="submit"
            onClick={() => closeDialog(true)}
            disabled={config?.mode === 'OTP'}
          >
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ConfirmationDialog;
