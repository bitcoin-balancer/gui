import { memo } from 'react';
import { Expand } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { IMarker, IPriceFormatterFunc } from '@/shared/components/charts/shared/types.ts';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Price History
 * Component in charge of displaying the expanded version of the position's history.
 */
const PriceHistory = memo(({
  record,
  markers,
  priceFormatterFunc,
}: {
  record: ICompactCandlestickRecords;
  markers: IMarker[];
  priceFormatterFunc: IPriceFormatterFunc
}) => (
  <Dialog>
    <DialogTrigger
      className='w-5 h-5'
      aria-label='Expand chart'
    >
      <Expand />
    </DialogTrigger>
    <DialogContent
      className='min-w-[90dvw]'
    >
      <DialogHeader>
        <DialogTitle>Price</DialogTitle>
        <DialogDescription>
          Position actions
        </DialogDescription>
      </DialogHeader>

      <CandlestickChart
        height={500}
        data={record}
        markers={markers}
        priceFormatterFunc={priceFormatterFunc}
      />
    </DialogContent>
  </Dialog>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceHistory;
