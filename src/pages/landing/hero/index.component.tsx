import { LogIn, ChartCandlestick } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { IHeroProps } from '@/pages/landing/hero/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Hero
 * Component in charge of displaying the introduction to the project.
 */
const Hero = ({
  breakpoint,
  openLargeInfoDialog,
  navigateToSection,
  navigate,
}: IHeroProps) => (
  <section
    id='landing-hero'
    className='bg-primary flex justify-center items-center shadow-6'
  >

    <div
      className='text-center text-slate-50 p-5 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12'
    >

      <h1
        className='text-4xl sm:text-5xl font-bold'
      >Trade like a proffessional consistently</h1>

      <p
        className='text-lg sm:text-xl mt-5'
      >
        Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to
        automate the <button onClick={() => openLargeInfoDialog('value_averaging')} className='font-extrabold'>Value Averaging Strategy</button> for Bitcoin
      </p>

      <div
        className='flex justify-center items-center mt-10'
      >

        <Button
          size={breakpoint === 'xs' ? 'default' : 'lg'}
          onClick={() => navigateToSection('position_sample')}
        ><ChartCandlestick className='mr-2' /> Learn more</Button>

        <Button
          size={breakpoint === 'xs' ? 'default' : 'lg'}
          onClick={() => navigate(NavService.dashboard())}
        ><LogIn className='mr-2' /> Go to app</Button>

      </div>

    </div>

  </section>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Hero;
