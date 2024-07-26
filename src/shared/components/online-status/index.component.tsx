import { Router } from 'lucide-react';
import useOnlineStatus from '../../hooks/online-status/index.hook';





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Online Status Component
 * Component in charge of notifying the user when there are network issues.
 */
const OnlineStatus = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const isOnline = useOnlineStatus();





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div aria-label='Experiencing Network Issuess'
          role='alert'
          className={`fixed bottom-5 inset-x-0 z-20 w-64 mx-auto text-left bg-white shadow-3 border border-slate-200 p-3 transition-transform duration-500 ${!isOnline ? 'translate-y-0' : 'translate-y-40'}`}>
      <div className='flex justify-center items-center animate-pulse'>
        <Router className='mr-2' aria-hidden='true' />
        <p>Connecting to Balancer...</p>
      </div>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default OnlineStatus;
