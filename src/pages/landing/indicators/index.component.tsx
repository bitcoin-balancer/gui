import { memo } from 'react';
import {
  Bitcoin,
  ChartCandlestick,
  Droplet,
  Undo2,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { IIndicatorProps, IIndicatorsProps } from '@/pages/landing/indicators/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Retrieves an indicator's icon by title.
 * @param title
 * @returns JSX.Element
 */
const getIconByTitle = (title: string): JSX.Element => {
  const props = { 'aria-hidden': true, className: 'w-10 h-10' };
  switch (title) {
    case 'Window':
      return <ChartCandlestick {...props} />;
    case 'Liquidity':
      return <Droplet {...props} />;
    case 'Coins':
      return <Bitcoin {...props} />;
    case 'Reversal':
      return <Undo2 aria-hidden='true' className={`${props.className} rotate-90`} />;
    default:
      throw new Error(`The title '${title}' is invalid.`);
  }
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Indicator
 * Component in charge of displaying an indicator card.
 */
const Indicator = ({
  title,
  description,
  openDialog,
}: IIndicatorProps) => (
  <Card
    className='border-solid shadow-sm w-10/12 sm:w-full'
  >
    <CardContent
      className='text-center flex flex-col items-center p-6 md:p-6'
    >
      {getIconByTitle(title)}
      <h3 className='text-xl font-bold mt-2'>{title}</h3>
      <p className='text-light text-sm'>{description}</p>

      <span className='flex-1'></span>

      <Button
        variant='outline'
        onClick={openDialog}
        className='mt-4'
      >
        Learn more
      </Button>
    </CardContent>
  </Card>
);




/**
 * Indicators Component
 * Component in charge of listing and explaining how the indicators work
 */
const Indicators = memo(({ openLargeInfoDialog }: IIndicatorsProps) => (
  <div
    className='w-full flex justify-center items-start'
  >
    <section
      className='w-full sm:w-11/12 md:w-9/12 lg:w-7/12 xl:w-10/12 2xl:w-9/12 p-3'
    >
      <header className='text-center'>
        <h2
          className='text-center text-4xl sm:text-5xl font-bold'
        >Indicators</h2>
        <p className='text-xs sm:text-sm mt-2 text-light'>
          Tools used by Balancer to monitor the state of the market
        </p>
      </header>

      <div
        className='grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-8 mt-10 justify-items-center'
      >
        <Indicator
          title='Window'
          description='Tracks Bitcoin‘s price and trend over a dynamic time window'
          openDialog={() => openLargeInfoDialog('window')}
        />

        <Indicator
          title='Liquidity'
          description='Monitors Bitcoin‘s buy and sell order activity'
          openDialog={() => openLargeInfoDialog('liquidity')}
        />

        <Indicator
          title='Coins'
          description='Measures capital flow across the cryptocurrency market'
          openDialog={() => openLargeInfoDialog('coins')}
        />

        <Indicator
          title='Reversal'
          description='Assesses the likelihood of a price reversal after a crash'
          openDialog={() => openLargeInfoDialog('reversal')}
        />
      </div>
    </section>
  </div>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Indicators;
