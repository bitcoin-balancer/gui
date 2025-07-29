import { memo } from 'react';
import { ChartCandlestick, LayoutPanelLeft } from 'lucide-react';
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
const Hero = memo(({ breakpoint, navigateToSection, navigate }: IHeroProps) => (
  <section
    id="landing-hero"
    className="bg-primary flex justify-center items-center shadow-6"
  >
    <div className="text-center text-slate-50 p-5 w-full sm:w-11/12 md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-6/12 animate-in fade-in duration-700">
      <h1 className="text-4xl sm:text-5xl font-bold">Trade like a professional consistently</h1>

      <p className="text-lg sm:text-xl mt-5">
        Balancer is a cutting-edge, open-source, self-hosted platform that empowers users to trade{' '}
        <strong>Bitcoin</strong> automatically
      </p>

      <div className="flex justify-center items-center mt-10">
        <Button
          size={breakpoint === 'xs' ? 'default' : 'lg'}
          onClick={() => navigateToSection('position_sample')}
        >
          <ChartCandlestick className="mr-2" /> Learn more
        </Button>

        <Button
          size={breakpoint === 'xs' ? 'default' : 'lg'}
          onClick={() => navigate(NavService.dashboard())}
        >
          <LayoutPanelLeft className="mr-2" /> Launch app
        </Button>
      </div>
    </div>
  </section>
));

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Hero;
