import { useCallback, useState } from 'react';
import { EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';
import { ENVIRONMENT } from '../environment/environment.ts';
import { Altcha } from '../shared/components/altcha/altcha.component.tsx';

import { Button } from '@/shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const App = () => {
  const [count, setCount] = useState(0);


  const handleAltchaVerification = useCallback((payload: string) => {
    console.log(payload);
  }, []);

  return (
    <>
      <h1 className="text-5xl">Balancer GUI: {count}</h1>
      <p>Production: {ENVIRONMENT.production ? 'true' : 'false'}</p>
      <p>{ENVIRONMENT.version}</p>
      <button className='px-5 py-3 hover:bg-slate-200' onClick={() => setCount(count + 1)}>+1</button>
      <br/><br/>
      <Button><EnvelopeOpenIcon className="mr-2 h-4 w-4" /> Login with Email</Button>
    <Button disabled>
      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
      Please wait
    </Button>
      <br/><br/>
      <Altcha onVerified={handleAltchaVerification}/>
    </>
  );
};


/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  App,
};
