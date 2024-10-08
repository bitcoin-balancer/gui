import { memo } from 'react';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of technologies used
const ITEMS = [
  'ubuntu',
  'bash',
  'docker',
  'git',
  'postgres',
  'javascript',
  'typescript',
  'eslint',
  'zod',
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
  'zustand',
  'shadcn',
];




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Technologies
 * Component in charge of displaying the technologies that were used to build Balancer.
 */
const Technologies = memo(() => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full sm:w-10/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 p-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Tech stack</h2>
        <p className='text-xs sm:text-sm mt-2 text-light'>
          Technologies used to build Balancer
        </p>
      </header>

      <div
        className='mt-5 flex justify-center items-center flex-wrap gap-4'
      >
        {
          ITEMS.map((item) => (
            <img key={item}
              src={`technologies/${item}.png`}
              alt={`${item} logo`}
              className='w-10 h-10'
              width='40'
              height='40'
              loading='lazy'
            />
          ))
        }
      </div>
    </section>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Technologies;
