import { Socket } from 'socket.io-client';
import { ICompactAppEssentials } from '@/shared/backend/data-join/index.service.ts';

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Socket IO Service
 * Object in charge of exposing a Socket.IO instance to all of Balancer's modules.
 */
type ISocketIOService = {
  // properties
  connected: boolean;
  socket: ISocket;
  transport: ITransport;
  connectionError: string | undefined;

  // ...
};

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Transports
 * A connection with Balancer's Socket.io server can be established in several ways based on the
 * user's browser capabilities: https://socket.io/docs/v4/engine-io-protocol/#transports
 */
type ITransport = 'polling' | 'websocket';

/**
 * Event Name
 * Each event has a unique name that is used when emiting or listening to values.
 */
type IEventName = 'compact_app_essentials';

/**
 * Server To Client Events
 * Events that are broadcasted only from the server.
 */
type IServerToClientEvents = {
  compact_app_essentials: (payload: ICompactAppEssentials) => void;
};

/**
 * Client To Server Events
 * Events that are broadcasted only from the client.
 */
type IClientToServerEvents = object;

/**
 * Socket
 * The instance of the socket tailored to meet Balancer's requirements
 */
type ISocket = Socket<IServerToClientEvents, IClientToServerEvents>;

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  ISocketIOService,

  // types
  ITransport,
  IEventName,
  IServerToClientEvents,
  IClientToServerEvents,
  ISocket,
};
