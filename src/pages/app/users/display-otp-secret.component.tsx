import { memo, useMemo } from 'react';
import { KeyRound, Copy } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../../../shared/shadcn/components/ui/dialog.tsx';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import { ClipboardService } from '../../../shared/services/clipboard/index.service.ts';
import { UserService } from '../../../shared/backend/auth/user/index.service.ts';
import { useAPIRequest } from '../../../shared/hooks/api-request/api-request.hook.ts';
import PageLoadError from '../../../shared/components/page-load-error/index.component.tsx';
import PageLoader from '../../../shared/components/page-loader/index.component.tsx';
import { IDisplayOTPSecretProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Display OTP Secret Component
 * Component in charge of displaying an user's OTP Secret.
 */
const DisplayOTPSecret = memo(({ open, onOpenChange, uid }: IDisplayOTPSecretProps) => {
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
    content = <PageLoadError error={error} />;
  } else if (loading) {
    content = <PageLoader variant='dialog' />;
  } else {
    content = (
    <>
      <div className='flex justify-start items-center border border-slate-300 rounded-md px-3 py-3 shadow-md animate-in fade-in duration-700'>
        <KeyRound aria-hidden='true' className='mr-2' /> <p className='text-sm sm:text-md md:text-lg'>{data}</p>
        <span className='flex-1'></span>
        <Button variant='ghost' size='icon' onClick={() => ClipboardService.writeText(data)} aria-label='Copy the OTP secret'><Copy aria-hidden='true' /></Button>
      </div>
      <p className='text-light text-xs text-center'>The OTP Secret is a sensitive piece of data. Make sure to share it with great care</p>
    </>
    );
  }
  return (
    <Dialog open={open} onOpenChange={() => onOpenChange(false)}>
      <DialogContent>

        <DialogHeader>
          <DialogTitle>OTP Secret</DialogTitle>
          <DialogDescription>
            The secret is required to sign in and interact with Balancer.
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
