import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Reversal
 * Component in charge of explaining how the reversal indicator works.
 */
const Reversal = () => (
  <>
    <p>
      The Reversal Indicator activates during significant price drops within the Window Indicator's
       observation period. During this time, It collaborates with other indicators to assess the
        likelihood of a price reversal.
    </p>

    <h2 className='text-lg font-semibold'>Calculation</h2>
    <p>
      Each indicator contributes a weighted score based on its relevance to potential price
       reversals. A minimum number of points must be accumulated across all indicators to trigger
        a reversal event.
    </p>
    <p>
      The score is calculated every time the Window Indicator fetches new data (every ~3 seconds
       by default).
    </p>

    <img
      src='large-info-dialog/reversal/points.png'
      alt='Screenshot showing how the reversal points are calculated'
      width='852'
      height='578'
    />
    <p className='text-light text-xs text-center'>
      Example of a how the reversal points are calculated
    </p>


    <Separator className='my-5' />

    <h2 className='text-lg font-semibold'>Price crash state</h2>
    <p>
      The Reversal Indicator's activation during price crashes aligns with Balancer's
       "value averaging" trading strategy, which aims to increase portfolio size during price dips
        and reduce it during rallies. This strategic approach leverages the potential for price
         reversals following significant market downturns.
    </p>

    <img
      src='large-info-dialog/reversal/decreasing-strongly.png'
      alt='Screenshot showing what a price crash looks like'
      width='852'
      height='578'
    />
    <p className='text-light text-xs text-center'>
      Example of a price crash
    </p>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Reversal;
