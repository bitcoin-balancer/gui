import { useState } from 'react';
import { ENVIRONMENT } from '../environment/environment.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */
const App = () => {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1 className="text-5xl">Balancer GU: {count}</h1>
      <p>Production: {ENVIRONMENT.production ? 'true' : 'false'}</p>
      <p>{ENVIRONMENT.version}</p>
      <button className='px-5 py-3 hover:bg-slate-200' onClick={() => setCount(count + 1)}>+1</button>
    </>
  );
};


/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  App,
};
