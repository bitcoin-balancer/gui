import { memo } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/shadcn/components/ui/carousel.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Planner
 * Component in charge of describing Balancer's Position Planner.
 */
const Planner = memo(() => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full md:w-11/12 xl:w-9/12 2xl:w-7/12'
    >

      <div
        className='w-full flex flex-col md:flex-row justify-center items-center gap-4'
      >
        <aside
          className='w-full text-center md:text-left p-3'
        >
          <h2
            className='text-4xl sm:text-5xl font-bold'
          >
            Never trade without a plan. <strong>Again.</strong>
          </h2>
          <p className='mt-5 text-lg'>
            Balancer always plans ahead, automatically adjusting your positions to navigate market
             volatility and maximize your profits.
          </p>
          <p className='text-xs sm:text-sm mt-2 text-light'>
            You set the parameters; Balancer plans and executes the strategy.
          </p>
        </aside>

        <article
          className='w-full 2xl:w-10/12 px-5 sm:px-0'
        >
          <Carousel
            opts={{
              align: 'center',
              loop: true,
            }}
            plugins={[
              Autoplay({ delay: 4000 }),
            ]}
          >
            <CarouselContent>
              <CarouselItem
                className='basis-full'
              >
                <div
                  className='w-full flex justify-center'
                >
                  <img
                    src='landing-page/planner/increase.png'
                    alt='Plan to increase a position'
                    width='915'
                    height='1053'
                    loading='lazy'
                  />
                </div>
              </CarouselItem>
              <CarouselItem
                className='basis-full'
              >
                <div
                  className='w-full flex justify-center'
                >
                  <img
                    src='landing-page/planner/decrease.png'
                    alt='Plan to decrease a position'
                    width='915'
                    height='1053'
                    loading='lazy'
                  />
                </div>
              </CarouselItem>
            </CarouselContent>
          </Carousel>
        </article>
      </div>



    </section>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Planner;
