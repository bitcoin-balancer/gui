

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Coins
 * Component in charge of explaining how the coins indicator works.
 */
const Coins = () => (
  <>
    <p>
      The Coins Indicator tracks the price movements of a selection of cryptocurrencies, chosen
       based on market capitalization and trading volume. It connects to a pre-configured exchange
        in real-time and analyzes price data for
         both <strong>COIN/BTC</strong> and <strong>COIN/USD</strong> pairs
          within a dynamic moving window.
    </p>
    <p>
      Similar to the Window Indicator, the Coins Indicator calculates a "state" for each coin, but
       it focuses on a shorter time frame, using approximately 40 minutes of historical data
        compared to the Window Indicator's 32-hour window. This allows Balancer to monitor the
         flow of capital across the entire cryptocurrency market.
    </p>
    <p>
      The <strong>Reversal Indicator</strong> leverages these calculated states to assess the
       overall market direction and identify potential price reversals.
    </p>
    <img
      src='large-info-dialog/coins/list.png'
      alt='Screenshot showing what a coins‘ state snapshot looks like'
      width='948'
      height='569'
    />
    <p className='text-light text-xs text-center'>
      The states for a series of coins
    </p>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Coins;
