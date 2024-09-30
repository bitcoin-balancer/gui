

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Monitoring
 * Component in charge of displaying the technologies that were used to build Balancer.
 */
const Monitoring = () => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full md:w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-6/12'
    >
      <header className='text-center p-3'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Monitoring</h2>
        <p className='text-xs sm:text-sm mt-2 text-light'>
          Analyze your performance and tune your strategy
        </p>
      </header>

      <div>
        <img
          src='landing-page/monitoring.png'
          alt='Monitoring screenshot'
          width='1107'
          height='612'
          className='mt-3'
        />
      </div>
    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Monitoring;
