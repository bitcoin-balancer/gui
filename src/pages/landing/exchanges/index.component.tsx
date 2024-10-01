import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/shadcn/components/ui/carousel.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// list of exchanges supported by Balancer
const EXCHANGES = [
  { id: 'binance', className: 'max-w-40 sm:max-w-44' },
  { id: 'bitfinex', className: 'max-w-44 sm:max-w-48' },
  { id: 'kraken', className: 'max-w-36 sm:max-w-40' },
  { id: 'coinbase', className: 'max-w-36 sm:max-w-40' },
  { id: 'okx', className: 'max-w-20 sm:max-w-24' },
];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Exchanges
 * Component in charge of displaying the list of supported exchanges.
 */
const Exchanges = () => (
  <div
    className='w-full flex justify-center items-start bg-primary text-slate-50 shadow-4'
  >
    <section
      className='w-full lg:w-10/12 xl:w-9/12 2xl:w-7/12 py-20 md:py-28 px-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Multi-exchange</h2>
        <p className='text-xs sm:text-sm mt-2 text-slate-200'>
          Operate with your preferred platform
        </p>
      </header>

      <Carousel
        className='mt-10'
        opts={{
          align: 'center',
          loop: true,
        }}
        plugins={[
          Autoplay({ delay: 1500 }),
        ]}
      >
        <CarouselContent>
          {
            EXCHANGES.map((item) => (
              <CarouselItem
                key={item.id}
                className='basis-full'>
                <div
                  className='w-full flex justify-center'
                >
                  <img
                    src={`exchanges/white/${item.id}.png`}
                    alt={`${item.id} logo`}
                    className={item.className}
                  />
                </div>
              </CarouselItem>
            ))
          }
        </CarouselContent>
      </Carousel>
    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Exchanges;
