import { memo, useState, useEffect } from 'react';
import {
  HardDriveDownload,
  Check,
  CheckCheck,
  Loader2,
  Bug,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { ITransport, SocketIOService } from '@/shared/backend/socket-io/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the state of the connection to the socket.io server
type ISocketIOStatus = {
  connected: boolean;
  hasSocketInstance: boolean;
  transport: ITransport;
  connectionError: string | undefined;
};




/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// it will refetch the state of socket.io every REFETCH_FREQUENCY seconds
const REFETCH_FREQUENCY = 5;




/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Retrieves the current status of the socket.io connection.
 * @returns ISocketIOStatus
 */
const getStatus = (): ISocketIOStatus => ({
  connected: SocketIOService.connected,
  hasSocketInstance: SocketIOService.socket !== undefined,
  transport: SocketIOService.transport,
  connectionError: SocketIOService.connectionError,
});

/**
 * Retrieves the icon that will be placed in the navigation menu based on the current status.
 * @param status
 * @returns JSX.Element
 */
const getNavIcon = (status: ISocketIOStatus): JSX.Element => {
  if (status.connected) {
    return status.transport === 'websocket'
      ? <CheckCheck
        aria-hidden='true'
        className='text-success'
      />
      : <Check
        aria-hidden='true'
        className='text-green-700'
      />;
  }
  return status.hasSocketInstance
    ? <Loader2
      className='animate-spin light-text w-5 h-5'
    />
    : <Bug
      className='text-error w-5 h-5'
    />;
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Socket IO Status
 * Component in charge of observing the status of the Socket IO Connection.
 */
const SocketIOStatus = memo(() => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [status, setStatus] = useState<ISocketIOStatus>(getStatus());
  const [open, setOpen] = useState<boolean>(false);





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Synchronizes Socket.io's status with the component's state.
   */
  useEffect(() => {
    const updateStatus = (): void => setStatus(getStatus());
    const intervalID: NodeJS.Timeout = setInterval(updateStatus, REFETCH_FREQUENCY * 1000);
    return () => clearInterval(intervalID);
  }, []);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  const icon = getNavIcon(status);
  return (
    <>
      <Button
        variant='ghost'
        className='w-full justify-start'
        onClick={() => setOpen(true)}
      >
        <HardDriveDownload /> <span className='ml-2'>Socket.io</span>
        <span className='flex-1'></span>
        {icon}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Socket IO</DialogTitle>
            <DialogDescription>
              The status of the connection with Balancer's Socket.io server
            </DialogDescription>
          </DialogHeader>

          <div className='flex justify-start items-center'>
            <p className='text-light text-sm'>Connection</p>
            <span className='flex-1'></span>
            {
              status.connected
                ? <p
                  className='text-success'
                >Established</p>
                : <p
                  className='text-light'
                >{status.hasSocketInstance ? 'Reconnecting...' : 'None'}</p>
            }
          </div>

          <div className='flex justify-start items-center'>
            <p className='text-light text-sm'>Transport</p>
            <span className='flex-1'></span>
            <Badge
              variant='secondary'
              className='text-sm'
            >{status.transport}</Badge>
          </div>

          {
            status.connectionError
            && <div className='flex justify-start items-start'>
              <p className='text-light text-sm min-w-20'>Error</p>
              <span className='flex-1'></span>
              <p
                className='text-error text-right'
              >{status.connectionError}</p>
            </div>
          }
        </DialogContent>
      </Dialog>
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default SocketIOStatus;
