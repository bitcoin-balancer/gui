import { Fragment, memo, useMemo } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { CandlestickService } from '@/shared/backend/candlestick/index.service.ts';
import { ReversalService } from '@/shared/backend/market-state/reversal/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Price Crash State History Dialog Component
 * Component in charge of displaying the event history charts for a record.
 */
const PriceCrashStateHistoryDialog = memo(
  ({
    id,
    cacheRecord,
    closeDialog,
  }: {
    id: string;
    cacheRecord: boolean;
    closeDialog: (nextState: undefined) => void;
  }) => {
    /* **********************************************************************************************
     *                                             STATE                                            *
     ********************************************************************************************** */
    const breakpoint = useMediaQueryBreakpoint();
    const { isDialogOpen, handleCloseDialog } = useLazyDialog(closeDialog);
    const { data, loading, error } = useAPIFetch(
      useMemo(
        () => ({
          fetchFn: () => ReversalService.getEventHistory(id, cacheRecord),
        }),
        [id, cacheRecord],
      ),
    );
    const exchangeConfig = useBoundStore((state) => state.exchangeConfig!);

    /* **********************************************************************************************
     *                                       REACTIVE VALUES                                        *
     ********************************************************************************************** */

    // the list of chart names
    const chartNames = useMemo(
      () => [
        'Total',
        'Liquidity',
        `Coins quote (COINS/${exchangeConfig.quoteAsset})`,
        `Coins base (COINS/${exchangeConfig.baseAsset})`,
      ],
      [exchangeConfig.quoteAsset, exchangeConfig.baseAsset],
    );

    // the list of compact candlestick records
    const records = useMemo(() => CandlestickService.splitRecords(data?.records), [data]);

    /* **********************************************************************************************
     *                                           COMPONENT                                          *
     ********************************************************************************************** */
    let content;
    if (error) {
      content = (
        <PageLoadError
          variant="dialog"
          error={error}
        />
      );
    } else if (loading) {
      content = <PageLoader variant="dialog" />;
    } else if (data && data.records.id.length === 0) {
      content = <NoRecords />;
    } else {
      content = (
        <div className="grid grid-cols-1 md:grid-cols-2 md:gap-16 animate-in fade-in duration-700">
          {records.map((record, i) => (
            <Fragment key={i}>
              <article>
                <h3 className="text-lg font-semibold">{chartNames[i]}</h3>

                <CandlestickChart
                  height={breakpoint === 'xs' || breakpoint === 'sm' ? 350 : 275}
                  data={record}
                />
              </article>
              {i < records.length - 1 && (breakpoint === 'xs' || breakpoint === 'sm') && (
                <Separator className="my-10 md:hidden" />
              )}
            </Fragment>
          ))}
        </div>
      );
    }
    return (
      <Dialog
        open={isDialogOpen}
        onOpenChange={handleCloseDialog}
      >
        <DialogContent className="max-w-[1000px]">
          <DialogHeader>
            <DialogTitle>Price crash state history</DialogTitle>
            <DialogDescription></DialogDescription>
          </DialogHeader>

          {content}
        </DialogContent>
      </Dialog>
    );
  },
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceCrashStateHistoryDialog;
