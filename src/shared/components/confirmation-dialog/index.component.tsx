import { useState } from 'react';
import { ClipboardIcon } from '@radix-ui/react-icons';
import { Button } from '../../shadcn/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../shadcn/components/ui/dialog';
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from '../../shadcn/components/ui/input-otp';
import { useBoundStore } from '../../store/index.ts';
import { IComponentProps } from './types';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Confirmation Dialog
 * Component in charge of ...
 */
const ConfirmationDialog = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const isOpen = useBoundStore((state) => state.isOpen);
  const onOpenChange = useBoundStore((state) => state.onOpenChange);
  console.log(isOpen);


  const handleClose = () => {

  };



  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Make changes to your profile here. Click save when you're done.
          </DialogDescription>
        </DialogHeader>
        <div className='flex justify-center items-center mt-5'>
          <InputOTP maxLength={6}>
            <InputOTPGroup>
              <InputOTPSlot index={0} className='shadow-md' />
              <InputOTPSlot index={1} className='shadow-md' />
              <InputOTPSlot index={2} className='shadow-md' />
            </InputOTPGroup>
            <InputOTPSeparator />
            <InputOTPGroup>
              <InputOTPSlot index={3} className='shadow-md' />
              <InputOTPSlot index={4} className='shadow-md' />
              <InputOTPSlot index={5} className='shadow-md' />
            </InputOTPGroup>
          </InputOTP>
          <Button variant="ghost" size="icon" className='sm:-mr-9'>
            <ClipboardIcon className="h-4 w-4" />
          </Button>
        </div>
        <p className='text-light text-center text-xs'>Enter your one-time password</p>
        <DialogFooter className='flex mt-5'>
          <Button variant='ghost' onClick={handleClose}>Cancel</Button>
          <span className='flex-1'></span>
          <Button onClick={handleClose} className='bg-primary'>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ConfirmationDialog;
