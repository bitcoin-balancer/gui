import { useRef, useEffect } from 'react';
import 'altcha';
import { ENVIRONMENT } from '../../../environment/environment.ts';
import { IProps, IStateChangeEvent } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const Altcha = ({ onVerified }: IProps) => {
  const ref = useRef<HTMLElement>(null);


  useEffect(() => {
    console.log('in useEffect');
    // element instance
    const el = ref.current;

    // state event handler
    const onStateChange = (event: IStateChangeEvent): void => {
      console.log(event.detail.state);
      if (event.detail.state === 'verified') {
        onVerified(event.detail.payload);
      } else if (event.detail.state === 'error') {
        onVerified('');
      }
    };

    // state event listener
    if (el) {
      console.log('in addEventListener');
      el.addEventListener('statechange', onStateChange);
    }

    // clean up
    return () => {
      console.log('in cleanUp');
      if (el) {
        el.removeEventListener('statechange', onStateChange);
      }
    };
  }, [onVerified]);

  return (
    <altcha-widget
      ref={ref}
      challengeurl={`${ENVIRONMENT.apiURL}/altcha`}
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
