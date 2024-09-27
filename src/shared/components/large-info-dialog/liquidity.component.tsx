

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Liquidity
 * Component in charge of explaining how the liquidity indicator works.
 */
const Liquidity = () => (
  <>
    <p>
      The Liquidity Indicator monitors the Bitcoin/Dollar order book on a pre-configured exchange
       in real-time. By analyzing and normalizing order book data, it detects unusual spikes in
        buying or selling liquidity.
    </p>
    <p>
      Once these peaks are identified on both the bid and ask sides,
      the <strong>"Bids' dominance"</strong> is calculated. This metric reflects the relative
       strength of buyers versus sellers.
    </p>
    <p>
      The <strong>Reversal Indicator</strong> then uses this
        dominance score to assess the current market direction and potential for a price reversal.
    </p>
    <img
      src='large-info-dialog/liquidity/summary.png'
      alt='Screenshot showing what a liquidity snapshot looks like'
      width='852'
      height='578'
    />
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Liquidity;
