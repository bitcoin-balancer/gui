

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
      className='w-full md:w-9/12 lg:w-7/12 xl:w-6/12 2xl:w-4/12 py-20 md:py-32 px-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Multi-exchange</h2>
        <p className='text-xs sm:text-sm mt-2 text-slate-200'>
          Operate with your preferred platform
        </p>
      </header>

      <div
        className='mt-10 flex justify-center items-center flex-wrap gap-14'
      >
        <img src='exchanges/white/binance.png' alt='Binance Logo' className='w-36' />
        <img src='exchanges/white/bitfinex.png' alt='Bitfinex Logo' className='w-44' />
        <img src='exchanges/white/kraken.png' alt='Kraken Logo' className='w-32' />
        <img src='exchanges/white/coinbase.png' alt='Coinbase Logo' className='w-36' />
        <img src='exchanges/white/okx.png' alt='OKX Logo' className='w-20' />
      </div>
    </section>
  </div>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Exchanges;
