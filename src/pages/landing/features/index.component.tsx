import { memo } from 'react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import {
  INCREASE_MARKERS,
  INCREASE_DATA,
  DECREASE_MARKERS,
  DECREASE_DATA,
} from '@/pages/landing/features/data.ts';
import { IFeaturesProps } from '@/pages/landing/features/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Features
 * Component in charge of describing Balancer's features.
 */
const Features = memo(({ breakpoint, openLargeInfoDialog, navigateToSection }: IFeaturesProps) => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full lg:w-11/12 xl:w-10/12 2xl:w-9/12'
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
            data={INCREASE_DATA}
            markers={INCREASE_MARKERS}
            state={-2}
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
        className='w-full flex flex-col-reverse md:flex-row justify-center items-center md:gap-10 mt-14 md:mt-0'
      >
        <article
          className='w-full flex-1'
        >
          <CandlestickChart
            height={breakpoint === 'xs' || breakpoint === 'sm' ? 400 : 500}
            data={DECREASE_DATA}
            markers={DECREASE_MARKERS}
            state={2}
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
            Balancer's <Button
              variant='link'
              className='text-lg text-sky-700 px-0'
              onClick={() => openLargeInfoDialog('strategy')}>profit optimization strategy</Button> automatically
               reduces your position size at intervals, taking into account the magnitude of your
                gains. The larger the profit, the more significant the reduction and the more
                 frequent the adjustments.
          </p>
        </aside>
      </div>

    </section>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Features;
