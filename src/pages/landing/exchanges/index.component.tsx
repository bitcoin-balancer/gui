import Autoplay from 'embla-carousel-autoplay';
import { Carousel, CarouselContent, CarouselItem } from '@/shared/shadcn/components/ui/carousel.tsx';
import { IExchangeID } from '@/shared/backend/exchange/index.service.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// list of exchanges supported by Balancer
const EXCHANGES: IExchangeID[] = ['binance', 'bitfinex', 'kraken', 'coinbase', 'okx'];





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
      className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 2xl:w-6/12 py-20 md:py-28 px-3'
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
        <CarouselContent
          className='items-center'
        >
          {
            EXCHANGES.map((id) => (
              <CarouselItem
                key={id}
                className='basis-full sm:basis-1/3'>
                <div
                  className='w-full flex justify-center items-center'
                >
                  <img
                    src={`exchanges/white/${id}.png`}
                    alt={`${id} logo`}
                    className='max-w-40 max-h-6'
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
