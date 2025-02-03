import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Strategy
 * Component in charge of explaining how the strategy module works.
 */
const Strategy = () => (
  <>
    <p>
      The Strategy monitors the state of the market and is responsible for opening, increasing,
       and decreasing positions based on events.
    </p>

    <h2 className='text-lg font-semibold'>Opening and increasing positions</h2>
    <p>
      Positions are opened or increased when the price has experienced a significant drop but
       indicators signal a potential price reversal. This strategy aims to capitalize on price dips
        by acquiring more assets at a lower price.
    </p>
    <p>
      If a position is at a loss, the Strategy may increase its size only if the new entry price
       improves the overall average cost.
    </p>
    <img
      src='large-info-dialog/strategy/decreasing-strongly.png'
      alt='Screenshot showing what a price crash looks like'
      width='852'
      height='578'
    />
    <p className='text-light text-xs text-center'>
      Example of a price crash
    </p>


    <Separator className='my-5' />

    <h2 className='text-lg font-semibold'>Decreasing positions</h2>
    <p>
      Profitable positions are gradually decreased as the price increases significantly. The higher
       the profit, the larger the percentage reduction and the more frequent the adjustments. This
        strategy helps to lock in gains and reduce exposure to potential price reversals.
    </p>
    <img
      src='large-info-dialog/strategy/increasing-strongly.png'
      alt='Screenshot showing what a price rally looks like'
      width='852'
      height='578'
    />
    <p className='text-light text-xs text-center'>
      Example of a price rally
    </p>

  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Strategy;
