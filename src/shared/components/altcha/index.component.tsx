/* eslint-disable no-console */
import { useEffect } from 'react';
import 'altcha';
import { AltchaService } from '@/shared/backend/altcha/index.service.ts';
import { IProps, IStateChangeEvent } from '@/shared/components/altcha/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Altcha Component
 * Component in charge of implementing the Altcha Widget and handling its events.
 */
const Altcha = ({ onChange, debug = false }: IProps) => {
  useEffect(() => {
    if (debug) console.log('in useEffect');
    // element instance
    const el: HTMLElement | undefined = document.getElementsByName('altcha-widget')[0];

    // state event handler
    const onStateChange = (event: IStateChangeEvent): void => {
      if (debug) console.log(event.detail.state);
      if (event.detail.state === 'verified') {
        onChange(event.detail.payload);
      } else if (event.detail.state === 'error') {
        onChange('');
      }
    };

    // state event listener
    if (el) {
      if (debug) console.log('in addEventListener');
      el.addEventListener('statechange', onStateChange);
    }

    // clean up
    return () => {
      if (debug) console.log('in cleanUp');
      if (el) {
        el.removeEventListener('statechange', onStateChange);
      }
    };
  }, [onChange, debug]);



  return (
    <altcha-widget
      name="altcha-widget"
      challengeurl={AltchaService.CHALLENGE_URL}
      refetchonexpire
      hidelogo
      hidefooter
    ></altcha-widget>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  Altcha,
};
