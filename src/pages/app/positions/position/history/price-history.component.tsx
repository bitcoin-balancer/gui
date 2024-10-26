import {
  memo,
  useEffect,
  useRef,
  useState,
} from 'react';
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
    let chartTimeout: NodeJS.Timeout | undefined;
    if (isOpen) {
      chartTimeout = setTimeout(() => {
        if (isOpen && chartContainerRef.current) {
          setChartHeight(chartContainerRef.current.clientHeight);
        }
      });
    }
    return () => {
      clearTimeout(chartTimeout);
    };
  }, [isOpen]);




  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger
        className='w-5 h-5'
        aria-label='Expand chart'
      >
        <Expand />
      </DialogTrigger>
      <DialogContent
        className='min-w-[90%]'
      >
        <DialogHeader>
          <DialogTitle>Price</DialogTitle>
          <DialogDescription>
            Position actions
          </DialogDescription>
        </DialogHeader>

        <div
          ref={chartContainerRef}
          className='min-h-[75dvh]'
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
