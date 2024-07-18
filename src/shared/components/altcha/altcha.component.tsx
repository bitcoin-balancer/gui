/* eslint-disable no-console */
import { useRef, useEffect } from 'react';
import 'altcha';
import { AltchaService } from '../../backend/altcha/altcha.service.ts';
import { IProps, IStateChangeEvent } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const Altcha = ({ onChange, debug }: IProps) => {
  const ref = useRef<HTMLElement>(null);


  useEffect(() => {
    if (debug) console.log('in useEffect');
    // element instance
    const el = ref.current;

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
      ref={ref}
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
