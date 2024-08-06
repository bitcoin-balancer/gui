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
import { ClipboardService } from '@/shared/services/clipboard/index.service.ts';
import { UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useAPIRequest } from '@/shared/hooks/api-request/index.hook.ts';
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
const DisplayOTPSecret = memo(({
  open,
  onOpenChange,
  uid,
  nickname,
}: IDisplayOTPSecretProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest<string>(
    UserService.getOTPSecret,
    useMemo(() => [uid], [uid]),
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  let content;
  if (error) {
    content = <PageLoadError variant='dialog' error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
      <>
        <div className='flex justify-start items-center border border-slate-300 rounded-md p-3 mt-2 shadow-md animate-in fade-in duration-700'>
          <KeyRound aria-hidden='true' className='mr-2' /> <p className='text-sm sm:text-md md:text-lg'>{data}</p>
          <span className='flex-1'></span>

          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='icon' onClick={() => ClipboardService.writeText(data)} aria-label='Copy the OTP secret'><Copy aria-hidden='true' /></Button>
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
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>

      <DialogContent className='max-h-dvh overflow-y-auto overflow-x-hidden'>

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
