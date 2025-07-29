import { useState, useEffect } from 'react';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { SocketIOService, IEventName } from '@/shared/backend/socket-io/index.service.ts';
import { ISocketData } from '@/shared/hooks/socket-event/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Socket Event Hook
 * Subscribes to an event and broadcasts all the messages.
 */
const useSocketEvent = <T extends IEventName>(name: IEventName): ISocketData<T> | undefined => {
  const authenticated = useBoundStore((state) => state.authenticated);
  const [data, setData] = useState<ISocketData<T> | undefined>();

  useEffect(() => {
    // event listener
    const listener = (payload: unknown): void => {
      setData(payload as ISocketData<T>);
    };

    // emitter
    if (authenticated) {
      SocketIOService.socket.on(name, listener);
    }

    // clean up (if possible)
    return () => {
      if (SocketIOService.socket) {
        SocketIOService.socket.off(name, listener);
      }
    };
  }, [name, authenticated]);

  return data;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { useSocketEvent };
