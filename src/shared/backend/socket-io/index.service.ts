/* eslint-disable no-lonely-if */
/* eslint-disable no-console */
import { io, type ManagerOptions, type SocketOptions } from 'socket.io-client';
import { extractMessage } from 'error-message-utils';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { buildAPIURL } from '../api/index.service.ts';
import { ISocketIOService, ISocket, ITransport } from './types.ts';
import { errorToast } from '@/shared/services/utils/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Socket IO Factory
 * Generates the object in charge of exposing a Socket.IO instance to all of Balancer's modules.
 * @returns ISocketIOService
 */
const socketIOServiceFactory = (): ISocketIOService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // if enabled, it will print events to the console
  const __DEBUG: boolean = true;

  // the URL of the Balancer API
  const __API_URL = buildAPIURL('');

  // the options that will be used to instantiate the socket connection
  const __CONFIG: Partial<ManagerOptions & SocketOptions> = {
    path: '/stream/',
    withCredentials: true,
  };

  // the current state of the connection
  let __connected: boolean = false;

  // the instance of the connection socket
  let __socket: ISocket;

  // the transport used to establish the connection
  let __transport: ITransport;

  // the error that was raised by the server when trying to connect to it
  let __connectionError: string | undefined;




  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  // 'connect' fired by the Socket instance upon connection and reconnection.
  const __onConnect = (): void => {
    __connected = true;
    __transport = <ITransport>__socket.io.engine.transport.name;
    if (__DEBUG) console.log(`socket.connect -> ${__transport}`);
  };

  // 'upgrade' fired when the transport is upgraded (i.e. from HTTP long-polling to WebSocket)
  const __onUpgrade = (): void => {
    __transport = <ITransport>__socket.io.engine.transport.name;
    if (__DEBUG) console.log(`socket.upgrade -> ${__transport}`);
  };

  // 'connect_error' fired upon connection failure.
  const __onConnectError = (error: Error): void => {
    __connected = false;
    const msg = extractMessage(error);
    if (__socket.active) {
      if (__DEBUG) console.log(`socket.connect_error -> temporary failure, will try to reconnect from: ${msg}`);
    } else {
      if (__DEBUG) console.log(`socket.connect_error -> unable to connect (fatal): ${msg}`);
      errorToast(msg, 'Socket Connection Error');
    }
  };

  // 'disconnect' fired upon disconnection.
  const __onDisconnect = (): void => {
    if (__DEBUG) console.log('socket.disconnect -> no actions');
  };





  /* **********************************************************************************************
   *                                      CONNECTION MANAGER                                      *
   ********************************************************************************************** */

  /**
   * Subscribes to the authenticated state of the user and handles each accordingly:
   * undefined: does nothing as the state has not been yet loaded
   * true: instantiates the socket, subscribes and handles the events
   * false: updates the connected state and disconnects the socket (if was previously connected)
   */
  useBoundStore.subscribe(
    (state) => state.authenticated,
    (authenticated) => {
      if (authenticated) {
        __socket = io(__API_URL, __CONFIG);
        __socket.on('connect', __onConnect);
        __socket.io.engine.once('upgrade', __onUpgrade);
        __socket.on('connect_error', __onConnectError);
        __socket.on('disconnect', __onDisconnect);
      } else if (authenticated === false) {
        __connected = false;
        if (__socket) {
          __socket.disconnect();
        }
        if (__DEBUG) console.log('authencated: false -> socket disconnected if existed');
      } else {
        if (__DEBUG) console.log('authencated: undefined -> no actions');
      }
    },
  );





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    get connected() {
      return __connected;
    },
    get socket() {
      return __socket;
    },
    get transport() {
      return __transport;
    },
    get connectionError() {
      return __connectionError;
    },

    // ...
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const SocketIOService = socketIOServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  SocketIOService,

  // types
  // ...
};
