import { memo, useCallback, useMemo, useState } from 'react';
import { ArrowLeftRight, EllipsisVertical, Menu, Pencil, Plus, Trash } from 'lucide-react';
import { getBigNumber } from 'bignumber-utils';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table.tsx';
import { errorToast } from '@/shared/services/utils/index.service.ts';
import {
  formatBitcoinAmount,
  formatDate,
  formatDollarAmount,
} from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ITrade } from '@/shared/backend/exchange/index.service.ts';
import { PositionService } from '@/shared/backend/position/index.service.ts';
import { useAPIFetch } from '@/shared/hooks/api-fetch/index.hook.ts';
import NoRecords from '@/shared/components/no-records/index.component.tsx';
import PageLoadError from '@/shared/components/page-load-error/index.component.tsx';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import { IPositionComponentProps } from '@/pages/app/positions/position/types.ts';
import { dispatch } from '@/pages/app/positions/position/trades/reducer.ts';
import RecordForm from '@/pages/app/positions/position/trades/record-form.component.tsx';
import {
  IAction,
  IDialogRecord,
  ITradeMetadata,
} from '@/pages/app/positions/position/trades/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the metadata for a list of trades to simplify the displaying of values.
 * @param trades
 * @returns ITradeMetadata[]
 */
const buildMetadata = (trades: ITrade[]): ITradeMetadata[] => {
  if (Array.isArray(trades) && trades.length) {
    const items: ITradeMetadata[] = [];
    let positionAmount = getBigNumber(0);
    trades.forEach((trade) => {
      if (trade.side === 'BUY') {
        positionAmount = positionAmount.plus(trade.amount).minus(trade.comission);
      } else {
        positionAmount = positionAmount.minus(trade.amount);
      }
      items.push({
        event_time: formatDate(trade.event_time, 'datetime-medium'),
        price: formatDollarAmount(trade.price),
        amount: formatBitcoinAmount(trade.amount),
        comission:
          trade.side === 'BUY'
            ? formatBitcoinAmount(trade.comission)
            : formatDollarAmount(trade.comission),
        positionAmount: formatBitcoinAmount(positionAmount.toNumber()),
      });
    });
    return items;
  }
  return [];
};

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Trades
 * Component in charge of displaying the trades that took place in a position.
 */
const Trades = memo(({ position, setSidenavOpen, refetchPosition }: IPositionComponentProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, setData, loading, error } = useAPIFetch(
    useMemo(
      () => ({
        fetchFn: () => PositionService.listPositionTrades(position.id),
      }),
      [position.id],
    ),
  );
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const [activeDialog, setActiveDialog] = useState<IDialogRecord>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const { authority } = useBoundStore((state) => state.user!);

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // trades' metadata
  const metadata = useMemo(() => buildMetadata(data), [data]);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Dispatches an action to the module's reducer.
   * @param action
   */
  const handleDispatch = useCallback(
    async (action: IAction | undefined) => {
      setActiveDialog(undefined);
      if (action) {
        dispatch(action, data, setData);
        refetchPosition();
      }
    },
    [data, setData, refetchPosition],
  );

  /**
   * Prompts the user with the confirmation dialog and deletes a trade.
   */
  const deleteTrade = (record: ITrade) => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Delete trade',
      description: `The record ${record.id} will be deleted and the position will be updated immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await PositionService.deleteTrade(record.id!, confirmation);
          handleDispatch({ type: 'DELETE_TRADE', payload: record.id! });
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (error) {
    return <PageLoadError error={error} />;
  }
  if (loading) {
    return <PageLoader />;
  }
  return (
    <>
      <div className="page-container flex justify-center items-start animate-in fade-in duration-700">
        <section className="w-full xl:w-11/12 2xl:w-9/12">
          {/* ********
           * HEADER *
           ******** */}
          <header className="flex justify-start items-center mb-5">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 lg:hidden"
              onClick={() => setSidenavOpen(true)}
              aria-label="Open Side Navigation"
            >
              <Menu aria-hidden="true" />
            </Button>

            <h1 className="text-2xl font-semibold leading-none tracking-tight">Trades</h1>
            <span className="flex-1"></span>

            {/* *****************
             * DESKTOP ACTIONS *
             ***************** */}
            <Button
              variant="outline"
              disabled={isSubmitting}
              onClick={() => openPositionDialog(position)}
              className="mr-2 hidden sm:flex"
              aria-label="Display position"
            >
              <ArrowLeftRight
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              />{' '}
              Display position
            </Button>
            <Button
              className="hidden sm:flex"
              onClick={() => setActiveDialog(null)}
              disabled={position.close !== null || isSubmitting || authority < 4}
            >
              <Plus
                aria-hidden="true"
                className="w-4 h-4 mr-2"
              />{' '}
              Add trade
            </Button>

            {/* ****************
             * MOBILE ACTIONS *
             **************** */}
            <DropdownMenu>
              <DropdownMenuTrigger
                className="sm:hidden"
                disabled={isSubmitting}
              >
                <EllipsisVertical aria-hidden="true" />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  onClick={() => openPositionDialog(position)}
                  aria-label="Display position"
                >
                  <ArrowLeftRight
                    aria-hidden="true"
                    className="w-4 h-4 mr-2"
                  />{' '}
                  Display position
                </DropdownMenuItem>
                <DropdownMenuItem
                  aria-label="Add trade"
                  onClick={() => setActiveDialog(null)}
                  disabled={position.close !== null}
                >
                  <Plus
                    aria-hidden="true"
                    className="w-4 h-4 mr-2"
                  />{' '}
                  Add trade
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </header>

          {/* *********
           * CONTENT *
           ********* */}
          {data.length ? (
            <>
              <Card className="md:mt-5">
                <CardContent className="pt-0 md:p-0 md:mb-5">
                  <Table>
                    <TableCaption>A list of trades</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Side</TableHead>
                        <TableHead>Price</TableHead>
                        <TableHead>Amount</TableHead>
                        <TableHead>Comission</TableHead>
                        <TableHead>Pos. Amount</TableHead>
                        <TableHead>Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {data.map((record, i) => (
                        <TableRow
                          key={record.id}
                          className="animate-in fade-in duration-500"
                        >
                          {/* ******
                           * DATA *
                           ****** */}
                          <TableCell>
                            <p>{record.id}</p>
                          </TableCell>

                          <TableCell>
                            <p>{metadata[i].event_time}</p>
                          </TableCell>

                          <TableCell>
                            <p
                              className={`font-medium ${record.side === 'BUY' ? 'text-increase-1' : 'text-decrease-1'}`}
                            >
                              {record.side}
                            </p>
                          </TableCell>

                          <TableCell>
                            <p>{metadata[i].price}</p>
                          </TableCell>

                          <TableCell>
                            <p
                              className={`${record.side === 'BUY' ? 'text-increase-1' : 'text-decrease-1'}`}
                            >
                              {metadata[i].amount}
                            </p>
                          </TableCell>

                          <TableCell>
                            <p className="text-decrease-1">{metadata[i].comission}</p>
                          </TableCell>

                          <TableCell>
                            <p className="font-medium">{metadata[i].positionAmount}</p>
                          </TableCell>

                          {/* *********
                           * ACTIONS *
                           ********* */}
                          <TableCell>
                            {typeof record.notes === 'string' && (
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    aria-label="Trade actions menu"
                                    disabled={isSubmitting || authority < 4}
                                  >
                                    <EllipsisVertical aria-hidden="true" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem
                                    aria-label="Update a trade that was added manually"
                                    onClick={() => {
                                      setActiveDialog(record);
                                    }}
                                  >
                                    <Pencil
                                      aria-hidden="true"
                                      className="w-4 h-4 mr-1"
                                    />{' '}
                                    Update trade
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    aria-label="Delete a trade that was added manually"
                                    onClick={() => deleteTrade(record)}
                                  >
                                    <Trash
                                      aria-hidden="true"
                                      className="w-4 h-4 mr-1"
                                    />{' '}
                                    Delete trade
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </>
          ) : (
            <NoRecords />
          )}
        </section>
      </div>

      {/* **************
       * FORM DIALOGS *
       ************** */}
      {activeDialog !== undefined && (
        <RecordForm
          record={activeDialog}
          closeDialog={handleDispatch}
        />
      )}
    </>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Trades;
