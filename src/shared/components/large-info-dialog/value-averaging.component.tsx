import { Link } from 'lucide-react';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Value Averaging
 * Component in charge of explaining what the value averaging strategy is.
 */
const ValueAveraging = () => (
  <>
    <p>
      Value Averaging is a counter-cyclical trading strategy that takes advantage of market swings
       by buying during price dips and selling during price rallies. This is what happens in
        dollar-cost averaging as well, but the effect is less pronounced. Several independent
         studies have shown that over multiyear periods, value averaging can produce slightly
          superior returns to dollar-cost averaging, although both will closely resemble market
           returns over the same period.
    </p>
    <p>
      In dollar-cost averaging (<a href='https://www.investopedia.com/terms/d/dollarcostaveraging.asp' target='_blank' rel='noopener noreferrer'>DCA</a>), investors always make the same periodic investment. The only
       reason they buy more shares when prices are lower is that the shares cost less. In contrast,
        using value averaging, investors buy more shares because prices are lower, and the strategy
         ensures that the bulk of investments is spent on acquiring shares at lower prices.
    </p>
    <p>
      The reason value averaging may be more or less attractive to an investor than using a set
       contribution schedule is that you are somewhat protected from overpaying for stock when the
        market is hot. If you avoid overpaying, your long-term returns will be stronger compared to
         people who invested set amounts no matter the market condition.
    </p>
    <p>
      The biggest potential challenge with value averaging is that in a down market an investor
       might actually run out of money, making the larger required investments impossible before
        things turn around. This problem can be amplified after the portfolio has grown larger
         when drawdown in the account could require substantially larger amounts of capital to
          stick with the VA strategy.
    </p>


    <h3 className='text-lg font-semibold mt-5'>Sources</h3>

    <ul>
      <li>
        <a
          href='https://www.investopedia.com/terms/v/value_averaging.asp'
          target='_blank'
          rel='noopener noreferrer'
          className='flex justify-start items-center gap-2 text-sky-700'>
          <Link aria-hidden='true' className='w-5 h-5' /> Value Averaging: What it Means, Examples
        </a>
      </li>
      <li>
        <a
          href='https://www.investopedia.com/articles/stocks/07/dcavsva.asp'
          target='_blank'
          rel='noopener noreferrer'
          className='flex justify-start items-center gap-2 text-sky-700'>
          <Link aria-hidden='true' className='w-5 h-5' /> Choosing Between Dollar-Cost and Value Averaging
        </a>
      </li>
    </ul>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default ValueAveraging;
