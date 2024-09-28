import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the function that calculates the window's state
const windowStateCalculationCode = `const calculateStateMean = (states: IState[]): IState => {
  const mean = calculateMean(states);
  if (mean >= 1.5) {
    return 2;
  }
  if (mean >= 0.75) {
    return 1;
  }
  if (mean <= -1.5) {
    return -2;
  }
  if (mean <= -0.75) {
    return -1;
  }
  return 0;
};
`;


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window
 * Component in charge of explaining how the window indicator works.
 */
const Window = () => (
  <>
    <p>
      The Window Indicator establishes a real-time connection with the pre-configured exchange and
       employs a dynamic moving window that analyzes Bitcoin's price to understand its current state
        and trend. This information allows Balancer to react to events accordingly.
    </p>

    <h2 className='text-lg font-semibold'>Calculation</h2>
    <p>
      The state of the window is calculated by applying eight distinct splits to the price dataset.
       Each split represents a different time frame, providing insights into long-term and
        short-term trends (giving more importance to the short-term).
    </p>
    <p>
      By default, the window utilizes 128 15-minute candlesticks, spanning approximately 32 hours.
       These splits are applied as follows:
    </p>
    <ul>
      <li>
        <Badge variant='secondary' className='text-sm'>100%</Badge> <span className='text-light text-sm'>last ~32 hours (128 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>75%</Badge> <span className='text-light text-sm'>last ~24 hours (96 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>50%</Badge> <span className='text-light text-sm'>last ~16 hours (64 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>25%</Badge> <span className='text-light text-sm'>last ~8 hours (32 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>15%</Badge> <span className='text-light text-sm'>last ~5 hours (20 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>10%</Badge> <span className='text-light text-sm'>last ~3.25 hours (13 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>5%</Badge> <span className='text-light text-sm'>last ~1.75 hours (7 items)</span>
      </li>
      <li>
        <Badge variant='secondary' className='text-sm'>2%</Badge> <span className='text-light text-sm'>last ~45 minutes (3 items)</span>
      </li>
    </ul>
    <p>
      The state of a split is derived by calculating the percentage change experienced from the
       beginning to the end of the dataset. The result is categorized into five distinct levels,
        indicating the strength and direction of the trend:
    </p>
    <ul>
      <li>
        <Badge className='text-sm bg-increase-2'>2</Badge> <strong className='text-increase-2'>Increasing strongly</strong> <span className='text-light text-sm'> - a clear upward trend with strong momentum</span>
      </li>
      <li>
        <Badge className='text-sm bg-increase-1'>1</Badge> <strong className='text-increase-1'>Increasing</strong> <span className='text-light text-sm'> - a positive trend, but with less intensity than "Increasing strongly"</span>
      </li>
      <li>
        <Badge className='text-sm bg-stateless'>0</Badge> <strong className='text-stateless'>Sideways</strong> <span className='text-light text-sm'> - a period of consolidation with no clear direction</span>
      </li>
      <li>
        <Badge className='text-sm bg-decrease-1'>-1</Badge> <strong className='text-decrease-1'>Decreasing</strong> <span className='text-light text-sm'> - a negative trend with moderate downward momentum</span>
      </li>
      <li>
        <Badge className='text-sm bg-decrease-2'>-2</Badge> <strong className='text-decrease-2'>Decreasing strongly</strong> <span className='text-light text-sm'> - a strong downward trend with significant downward momentum</span>
      </li>
    </ul>

    <p>
      Once the state for each split is calculated, the overall Window state is determined as
       follows:
    </p>
    <div
      className='mt-2 overflow-x-auto p-5 rounded-lg bg-slate-900 text-slate-50 text-sm'
    >
      <pre>{windowStateCalculationCode}</pre>
    </div>

    <h3 className='text-md font-semibold mt-5'>Calculation example</h3>
    <p>
      The following example provides a visual representation of how the window state is calculated
       for a random period:
    </p>
    <img
      src='large-info-dialog/window/window-state-calculation.png'
      alt='Screenshot showing how the state for each split is calculated'
      width='1243'
      height='767'
    />
    <p className='text-light text-xs text-center'>
      Example of a how the state of the window is calculated
    </p>


    <Separator className='my-5' />

    <h2 className='text-lg font-semibold'>Uses</h2>
    <p>
      The indicator plays a crucial role in triggering other modules based on the Window's state.
    </p>

    <div
      className='flex justify-start items-center gap-2'
    >
      <h3 className='text-md text-decrease-2 font-semibold'>Decreasing strongly</h3>
      <Badge className='bg-decrease-2'>-2</Badge>
    </div>

    <p>
      When the window identifies the price of Bitcoin has crashed, it activates
       the <strong>Reversal Indicator</strong>. This module analyzes various indicators to determine
        potential opportunities for opening or increasing the position, seeking to capitalize on
         the reversal of the downward trend.
    </p>
    <img
      src='large-info-dialog/window/decreasing-strongly.png'
      alt='Screenshot showing what a decreasing strongly state looks like'
      width='1243'
      height='767'
    />
    <p className='text-light text-xs text-center'>
      Example of a window that is decreasing strongly
    </p>

    <div
      className='flex justify-start items-center mt-7 gap-2'
    >
      <h3 className='text-md text-increase-2 font-semibold'>Increasing strongly</h3>
      <Badge className='bg-increase-2'>2</Badge>
    </div>

    <p>
      Conversely, when a strong upward trend is detected, the <strong>Strategy</strong> is
       triggered. This module assesses the current profit and loss (PNL) situation to determine if
        the position can be decreased, aiming to secure profits.
    </p>
    <img
      src='large-info-dialog/window/increasing-strongly.png'
      alt='Screenshot showing what an increasing strongly state looks like'
      width='903'
      height='533'
    />
    <p className='text-light text-xs text-center'>
      Example of a window that is increasing strongly
    </p>
  </>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Window;
