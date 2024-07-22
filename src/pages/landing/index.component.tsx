import { useCallback, useState } from 'react';
import { Link } from 'react-router-dom';
import { EnvelopeOpenIcon, ReloadIcon } from '@radix-ui/react-icons';
import { ENVIRONMENT } from '../../environment/environment.ts';
import { Altcha } from '../../shared/components/altcha/altcha.component.tsx';
import useMediaQueryBreakpoint from '../../shared/hooks/media-query-breakpoint/index.ts';
import useOnlineStatus from '../../shared/hooks/online-status/index.ts';

import { Button } from '@/shared/shadcn/components/ui/button.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const Landing = () => {
  console.log('in Landing');
  const [count, setCount] = useState(0);
  const breakpoint = useMediaQueryBreakpoint();
  const isOnline = useOnlineStatus();
  console.log('breakpoint', breakpoint);
  console.log('isOnline', isOnline);


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
      {/* <p>breakpoint: {breakpoint}</p> */}
      { /* <p>isOnline: {String(isOnline)}</p> */}
      <br/><br/>
      <Button><EnvelopeOpenIcon className="mr-2 h-4 w-4" /> Login with Email</Button>
      <br/><br/>

      <Button variant="link"><Link to='app/users'>Users</Link></Button>

    <Button disabled>
      <ReloadIcon className='mr-2 h-4 w-4 animate-spin' />
      Please wait
    </Button>
      <br/><br/>
      <Altcha onChange={handleAltchaVerification} debug={false}/>
    </>
  );
};


/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Landing;
