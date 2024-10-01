import { useCallback } from 'react';
import { formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { MARKERS, DATA } from '@/pages/landing/position-sample/data.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Features
 * Component in charge of describing Balancer's features.
 */
const Features = ({ breakpoint }: { breakpoint: IBreakpoint }) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the price formatter that will be used on the chart
  const priceFormatter = useCallback((value: number) => formatDollarAmount(value, 0), []);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <div
      className='w-full flex justify-center items-start'
    >
      <section
        className='w-full md:w-10/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12 relative'
      >

        {/* ********
          * HEADER *
          ******** */}
        <header
          className='w-full absolute z-10'
        >
          <div
            className='flex flex-col gap-3 sm:flex-row justify-center items-center'
          >
            <p
              className='text-4xl sm:text-5xl font-bold'
            ><strong className='text-increase-1 font-extrabold'>Buy</strong> the dip{breakpoint !== 'xs' ? '.' : ''}</p>
            <p
              className='text-4xl sm:text-5xl font-bold'
            ><strong className='text-decrease-1 font-extrabold'>Sell</strong> the rally</p>
          </div>
        </header>



        {/* *******
          * CHART *
          ******* */}
        <article
          className='mt-3 sm:-mt-5'
        >
          <CandlestickChart
            height={breakpoint === 'xs' || breakpoint === 'sm' ? 400 : 500}
            data={DATA}
            markers={MARKERS}
            priceFormatterFunc={priceFormatter}
            showAttributionLogo={false}
            hideTimeScale={true}
            hideRightPriceScale={true}
            hideCrosshair={true}
            hidePriceLine={true}
            disableScrollHandler={true}
            disableScaleHandler={true}
          />
        </article>

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Features;
