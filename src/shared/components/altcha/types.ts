import { DetailedHTMLProps, HTMLAttributes } from 'react';
import { IRecord } from '../../types';


/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Component Props
 * ...
 */
type IProps = {
  onVerified: (payload: string) => void;
};

/**
 * State Change Event
 * The event triggered by the Sltcha Widget when its state changes.
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
 * Altcha Widget Props
 * The properties accepted by the altcha-widget web component
 */
interface IAltchaWidgetProps extends DetailedHTMLProps<HTMLAttributes<HTMLElement>, HTMLElement> {
  // URL of your server to fetch the challenge from.
  challengeurl: string;

  // JSON-encoded challenge data. If avoiding an HTTP request to challengeurl, provide the data here
  challengejson?: IRecord;

  // automatically verify without user interaction
  auto?: 'onfocus' | 'onload' | 'onsubmit';

  // only used in conjunction with the spamfilter option. If enabled, it will block form submission
  // and fail verification if the Spam Filter returns a negative classification. This effectively
  // prevents submission of the form.
  blockspam?: boolean;

  // artificial delay in milliseconds to apply before the verification (defaults to 0)
  delay?: number;

  // the challenge expiration (duration in milliseconds)
  expire?: number;

  // enable Floating UI
  floating?: 'auto' | 'top' | 'bottom';

  // the CSS selector of the “anchor” to which the floating UI will be attached to (defaults to the
  // button[type="submit"] in the related form)
  floatinganchor?: string;

  // hide the footer (ALTCHA link)
  hidefooter?: boolean;

  // hide the ALTCHA logo
  hidelogo?: boolean;

  // the max. number to iterate to (defaults to 1,000,000)
  maxnumber?: number;

  // the name of the hidden field containing the payload (defaults to “altcha”)
  name?: string;

  // automatically re-fetch and re-validate when the challenge expires (defaults to true)
  refetchonexpire?: boolean;

  // enable the Spam Filter feature
  spamfilter?: boolean;

  // JSON-encoded translation strings
  strings?: IRecord;

  // enable server-side verification by configuring the URL to use for verification requests
  verifyurl?: boolean;

  // the number of workers to utilize for PoW (defaults to navigator.hardwareConcurrency || 8)
  workers?: number;

  // the URL of the Worker script (defaults to ./worker.js, only works with external build)
  workerurl?: string;

  // print log messages in the console
  debug?: boolean;

  // causes the verification to always fail with a “mock” error
  mockerror?: boolean;

  // generates a “mock” challenge within the widget, bypassing the request to challengeurl
  test?: boolean;
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

  /**
   * altcha-widget Web Component
   * The widget's web component is not in the Web Specification and therefore has to be declared
   * externally.
   */
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace JSX {
    interface IntrinsicElements {
      'altcha-widget': IAltchaWidgetProps
    }
  }
}





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IProps,
  IStateChangeEvent,
};
