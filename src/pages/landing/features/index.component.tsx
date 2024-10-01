import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { MARKERS, DATA } from '@/pages/landing/position-sample/data.ts';
import { IFeaturesProps } from '@/pages/landing/features/types.ts';
import { Button } from '@/shared/shadcn/components/ui/button';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Features
 * Component in charge of describing Balancer's features.
 */
const Features = ({ breakpoint, openLargeInfoDialog, navigateToSection }: IFeaturesProps) => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full md:w-11/12 lg:w-10/12 xl:w-9/12 2xl:w-8/12'
    >

      {/* **********
        * INCREASE *
        ********** */}
      <div
        className='w-full flex flex-col md:flex-row justify-center items-center gap-8'
      >
        <aside
          className='w-full flex-1 text-center md:text-left p-3'
        >
          <h2
            className='text-4xl sm:text-5xl font-bold'
          >
            <strong className='text-increase-1'>Increase</strong> your holdings during price crashes
          </h2>
          <p className='mt-5 text-lg'>
            Balancer uses a series
             of <Button
              variant='link'
              className='text-lg text-sky-700 px-0'
              onClick={() => navigateToSection('indicators')}>indicators</Button> to assess the
               probability of price reversals following significant price drops, allowing you to
                capitalize on potential rebound opportunities.
          </p>
        </aside>

        <article
          className='w-full flex-1'
        >
          <CandlestickChart
            height={breakpoint === 'xs' || breakpoint === 'sm' ? 400 : 500}
            data={DATA}
            markers={MARKERS}
            showAttributionLogo={false}
            hideTimeScale={true}
            hideRightPriceScale={true}
            hideCrosshair={true}
            hidePriceLine={true}
            disableScrollHandler={true}
            disableScaleHandler={true}
          />
        </article>
      </div>



      {/* **********
        * DECREASE *
        ********** */}
      <div
        className='w-full flex flex-col-reverse md:flex-row justify-center items-center md:gap-8 mt-14 md:mt-0'
      >
        <article
          className='w-full flex-1'
        >
          <CandlestickChart
            height={breakpoint === 'xs' || breakpoint === 'sm' ? 400 : 500}
            data={DATA}
            markers={MARKERS}
            showAttributionLogo={false}
            hideTimeScale={true}
            hideRightPriceScale={true}
            hideCrosshair={true}
            hidePriceLine={true}
            disableScrollHandler={true}
            disableScaleHandler={true}
          />
        </article>


        <aside
          className='w-full flex-1 text-center md:text-left p-3'
        >
          <h2
            className='text-4xl sm:text-5xl font-bold'
          >
            <strong className='text-decrease-1'>Decrease</strong> your holdings during price boosts
          </h2>
          <p className='mt-5 text-lg'>
            Balancer uses a series
            of <Button
              variant='link'
              className='text-lg text-sky-700 px-0'
              onClick={() => navigateToSection('indicators')}>indicators</Button> to assess the
              probability of price reversals following significant price drops, allowing you to
                capitalize on potential rebound opportunities.
          </p>
        </aside>
      </div>




    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Features;
