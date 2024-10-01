import {
  CodeXml,
  DraftingCompass,
  EarthLock,
  ShieldCheck,
} from 'lucide-react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Characteristics
 * Component in charge of displaying why people should use balancer.
 */
const Characteristics = () => (
  <div
    className='w-full flex justify-center items-start bg-primary text-slate-50 shadow-4'
  >
    <section
      className='w-full md:w-11/12 lg:w-9/12 xl:w-11/12 2xl:w-10/12 py-20 md:py-28 px-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Why Balancer?</h2>
        <p className='text-xs sm:text-sm mt-2 text-slate-200'>
          Some of the reasons why you should use Balancer
        </p>
      </header>

      <div
        className='mt-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 justify-between gap-10'
      >

        {/* **************
          * CONSERVATIVE *
          ************** */}
        <article className='text-center flex flex-col items-center'>
          <DraftingCompass aria-hidden='true' className='h-14 w-14' />

          <h3 className='text-2xl font-bold mt-2'>
            Conservative
          </h3>

          <p className='mt-1'>
          Balancer employs an automated value averaging strategy that leverages market data to
           optimize your Bitcoin holdings, aiming for long-term growth and minimizing the impact of
            short-term volatility.
          </p>
        </article>

        {/* *************
          * TRANSPARENT *
          ************* */}
        <article className='text-center flex flex-col items-center'>
          <CodeXml aria-hidden='true' className='h-14 w-14' />

          <h3 className='text-2xl font-bold mt-2'>
            Transparent
          </h3>

          <p className='mt-1'>
            Balancer's code is completely <strong>open source</strong>, allowing anyone to inspect
             and audit it for security and transparency. This ensures that the platform is built on
              a foundation of trust, stability and accountability.
          </p>
        </article>

        {/* *********
          * PRIVATE *
          ********* */}
        <article className='text-center flex flex-col items-center'>
          <EarthLock aria-hidden='true' className='h-14 w-14' />

          <h3 className='text-2xl font-bold mt-2'>
            Private
          </h3>

          <p className='mt-1'>
            Balancer is <strong>self-hosted</strong>, meaning you control your data and are not
             reliant on a centralized third party. This fosters greater privacy and security, as
              your data is not stored on servers accessible by others.
          </p>
        </article>

        {/* ********
          * SECURE *
          ******** */}
        <article className='text-center flex flex-col items-center'>
          <ShieldCheck aria-hidden='true' className='h-14 w-14' />

          <h3 className='text-2xl font-bold mt-2'>
            Secure
          </h3>

          <p className='mt-1'>
            Balancer employs advanced security protocols, undergoes regular security audits, and
             maintains a dedicated development team to address vulnerabilities and ensure ongoing
              platform stability.
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
