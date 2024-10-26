import { memo, useEffect, useRef, useState } from 'react';
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
}) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */
  const chartContainerRef = useRef<HTMLDivElement | null>(null);



  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [chartHeight, setChartHeight] = useState<number>();



  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */

  /**
   * Calculates the height of the chart based on the size of the card.
   */
  useEffect(() => {
    console.log('here');
    console.log(isOpen, chartContainerRef.current);
    if (isOpen && chartContainerRef.current) {
      console.log(chartContainerRef.current.clientHeight);
      setChartHeight(chartContainerRef.current.clientHeight);
    }
  }, [isOpen]);


  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className='w-5 h-5'
        aria-label='Expand chart'
      >
        <Expand />
      </DialogTrigger>
      <DialogContent
        className='min-h-[90%] min-w-[90%]'
      >
        <DialogHeader>
          <DialogTitle>Price</DialogTitle>
          <DialogDescription>
            Position actions
          </DialogDescription>
        </DialogHeader>

        <div
          ref={chartContainerRef}
          className='bg-slate-200'
        >
          {
            chartHeight !== undefined
            && <CandlestickChart
              height={chartHeight}
              data={record}
              markers={markers}
              priceFormatterFunc={priceFormatterFunc}
            />
          }
        </div>
      </DialogContent>
    </Dialog>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceHistory;
