

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Characteristics
 * Component in charge of displaying why people should use balancer.
 */
const Characteristics = () => (
  <div
      className='w-full flex justify-center items-start bg-primary text-white shadow-4'
  >
    <section
      className='w-full lg:w-11/12 xl:w-10/12 2xl:w-8/12 py-20 px-3'
    >
      <header>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Why choose Balancer?</h2>
      </header>

      <div
        className='mt-16 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 justify-between gap-10'
      >
        <article>
          <h3 className='text-white text-2xl text-center font-bold'>
            Transparent
          </h3>

          <p className='text-white text-center mt-2'>
            Balancer's code is completely <strong>open source</strong>, allowing anyone to inspect
             and audit it for security and transparency. This ensures that the platform is built on
              a foundation of trust and accountability
          </p>
        </article>
        <article>
          <h3 className='text-white text-2xl text-center font-bold'>
            Private
          </h3>

          <p className='text-white text-center mt-2'>
            Balancer is <strong>self-hosted</strong>, meaning you control your data and are not
             reliant on a centralized third party. This fosters greater privacy and security, as
              your data is not stored on servers accessible by others
          </p>
        </article>
        <article>
          <h3 className='text-white text-2xl text-center font-bold'>
            Secure
          </h3>

          <p className='text-white text-center mt-2'>
            Balancer employs advanced security protocols, undergoes regular security audits, and
             maintains a dedicated development team to address vulnerabilities and ensure ongoing
              platform stability
          </p>
        </article>
      </div>
    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Characteristics;
