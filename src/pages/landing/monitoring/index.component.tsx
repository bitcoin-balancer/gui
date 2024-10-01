import { memo } from 'react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Monitoring
 * Component in charge of displaying the technologies that were used to build Balancer.
 */
const Monitoring = memo(() => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full md:w-11/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12'
    >
      <header className='text-center p-3'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Monitoring</h2>
        <p className='text-xs sm:text-sm mt-2 text-light'>
          Analyze your performance and tune your strategy
        </p>
      </header>

      <div className='monitoring-container'>
        <img
          src='landing-page/monitoring.png'
          alt='Monitoring screenshot'
          width='927'
          height='641'
          loading='lazy'
        />
      </div>
    </section>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Monitoring;
