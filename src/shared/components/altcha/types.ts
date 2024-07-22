

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IProps = {
  // the function that will be invoked when the challenge is solved or in case of errors
  onChange: (payload: string) => void;

  // if enabled, logs will be printed at every step of the process
  debug?: boolean;
};

/**
 * State Change Event
 * The event triggered by the Altcha Widget when its state changes.
 */
type IEventState = 'error' | 'verified' | 'verifying' | 'unverified' | 'expired';
type IEventDetail = {
  // the current state of the Altcha element
  state: IEventState;

  // the Base64-encoded JSON payload (solution)
  payload: string;
};
interface IStateChangeEvent extends Event {
  isTrusted: boolean;
  bubbles: boolean;
  cancelBubble: boolean;
  cancelable: boolean;
  composed: boolean;
  currentTarget: EventTarget | null;
  defaultPrevented: boolean;
  detail: IEventDetail; // details regarding the outcome of the interaction
  eventPhase: number;
  returnValue: boolean;
  srcElement: EventTarget | null;
  target: EventTarget | null;
  timestamp: number;
  type: string; // so far I've only observed 'statechange'
}

/**
 * Global Types
 * The altcha widget is not included in the web specification and therefore, the element and the
 * events it emits must be declared externally.
 */
declare global {
  /**
   * HTML Element Events Map
   * The event issued by Altcha is not in the Web Specification and therefore, must be declared
   * externally.
   */
  interface HTMLElementEventMap {
    statechange: IStateChangeEvent;
  }
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IProps,
  IStateChangeEvent,
};
