

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of technologies used
const ITEMS = [
  'ubuntu',
  'bash',
  'docker',
  'git',
  'javascript',
  'typescript',
  'eslint',
  'nodejs',
  'npm',
  'rxjs',
  'expressjs',
  'socketio',
  'vitejs',
  'vitest',
  'jwt',
  'css',
  'html',
  'tailwindcss',
  'react',
  'react-router',
  'radixui',
  'postgres',
];




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Technologies
 * Component in charge of displaying the technologies that were used to build Balancer.
 */
const Technologies = () => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full md:w-11/12 lg:w-10/12 xl:w-8/12 2xl:w-6/12 p-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Technologies</h2>
        <p className='text-xs sm:text-sm mt-2 text-light'>
          Libraries and frameworks used to build Balancer
        </p>
      </header>

      <div
        className='mt-10 flex justify-center items-center flex-wrap gap-8'
      >
        {
          ITEMS.map((item) => (
            <img key={item}
              src={`technologies/${item}.png`}
              alt={`${item} logo`}
              className='floating-logo w-10 h-10 sm:w-14 sm:h-14'
            />
          ))
        }
      </div>
    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Technologies;
