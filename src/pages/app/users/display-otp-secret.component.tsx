import { memo, useMemo } from 'react';
import { KeyRound, Copy } from 'lucide-react';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { copyToClipboard } from '@/shared/services/utils/index.service.ts';
import { UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IDisplayOTPSecretProps } from '@/pages/app/users/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Display OTP Secret Component
 * Component in charge of displaying an user's OTP Secret.
 */
const DisplayOTPSecret = memo(({ uid, nickname, closeDialog }: IDisplayOTPSecretProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
  const { data, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => UserService.getOTPSecret(uid),
      }),
      [uid],
    ),
  );

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = (
      <PageLoadError
        variant="dialog"
        error={error}
      />
    );
  } else if (loading) {
    content = <PageLoader variant="dialog" />;
  } else {
    content = (
      <>
        <div className="flex justify-start items-center border border-slate-300 rounded-md px-3 py-5 mt-3 mb-3 shadow-md animate-in fade-in duration-700">
          <KeyRound
            aria-hidden="true"
            className="mr-2 w-6 h-6"
          />
          <p className="text-sm sm:text-md md:text-lg">{data}</p>

          <span className="flex-1"></span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => copyToClipboard(data)}
                aria-label="Copy the OTP secret"
              >
                <Copy aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to copy</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </>
    );
  }
  return (
    <Dialog
      open={isDialogOpen}
      onOpenChange={handleCloseDialog}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{nickname}'s OTP Secret</DialogTitle>
          <DialogDescription>
            The OTP Secret is a sensitive piece of data. Make sure to share it with great care
          </DialogDescription>
        </DialogHeader>

        {content}
      </DialogContent>
    </Dialog>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default DisplayOTPSecret;
