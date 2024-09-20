import { memo, useMemo, useState } from 'react';
import {
  EllipsisVertical,
  ArrowLeftRight,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ReceiptText,
  Wallet,
  List,
  ListChecks,
  Loader2,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from '@/shared/shadcn/components/ui/drawer.tsx';
import {
  formatBitcoinAmount,
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { delay, errorToast } from '@/shared/services/utils/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import {
  ICompactPosition,
  PositionService,
} from '@/shared/backend/position/index.service.ts';
import BalancesDialog from '@/pages/app/dashboard/position/balances/index.component.tsx';
import PositionsDialog from '@/pages/app/dashboard/position/positions/index.component.tsx';
import TransactionsDialog from '@/pages/app/dashboard/position/transactions/index.component.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the percentages that can be used to reduce the amount of a position
const DECREASE_OPTIONS: number[] = [5, 15, 25, 33, 50, 66, 75, 100];





/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds a decrease option based on the existing position and an option.
 * @param position
 * @param option
 * @returns { percentage: number; amount: number; label: string; }
 */
const buildDecreaseOption = (position: ICompactPosition | undefined, option: number) => {
  const decreaseAmount = position === undefined
    ? PositionService.calculateDecreaseAmount(0, option)
    : PositionService.calculateDecreaseAmount(position.amount, option);
  return {
    percentage: option,
    amount: decreaseAmount,
    label: formatBitcoinAmount(decreaseAmount),
  };
};





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Component
 * Component in charge of displaying information regarding the active position (if any)
 */
const Position = memo(({ position }: { position: ICompactPosition | undefined }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isDecreaseMenuOpen, setIsDecreaseMenuOpen] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [activeDialog, setActiveDialog] = useState<'balances' | 'positions' | 'transactions'>();
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // main position details
  const entry = useMemo(
    () => (position === undefined ? '$0' : formatDollarAmount(position.entry_price, 0)),
    [position],
  );
  const gain = useMemo(
    () => (position === undefined ? '0%' : formatPercentageChange(position.gain, 2)),
    [position],
  );
  const gainClassName = useMemo(
    () => (
      position === undefined
        ? PositionService.getGainClassName(0)
        : PositionService.getGainClassName(position.gain)
    ),
    [position],
  );
  const amount = useMemo(
    () => (position === undefined ? '₿0 ' : formatBitcoinAmount(position.amount)),
    [position],
  );
  const decreased = useMemo(
    () => (position === undefined ? '$0 ' : formatDollarAmount(position.amount_quote_out)),
    [position],
  );
  const decreaseMenu = useMemo(
    () => DECREASE_OPTIONS.map((option) => buildDecreaseOption(position, option)),
    [position],
  );





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Prompts the user with the confirmation dialog and opens/increases the position if confirmed.
   */
  const increasePosition = () => {
    openConfirmationDialog({
      mode: 'OTP',
      title: position === undefined ? 'Open position' : 'Increase position',
      description: position === undefined
        ? 'A new position will be opened with the amount established in the strategy'
        : 'The amount of the position will be increased following the strategy',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await PositionService.increasePosition(confirmation);
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /**
   * Prompts the user with the confirmation dialog and decreases the position if confirmed.
   * @param percentage
   */
  const decreasePosition = async (percentage: number) => {
    setIsDecreaseMenuOpen(false);
    await delay(0.25);
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Decrease position',
      description: `The amount of the position will be decreased by ~${percentage}% immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await PositionService.decreasePosition(percentage, confirmation);
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
  return (
    <>

      {/* ******
        * CARD *
        ****** */}
      <Card className='md:mt-2.5 lg:mt-0'>
        <CardHeader>
          <CardTitle className='flex justify-start items-center'>
            Position
            {
                isSubmitting
                && <Loader2
                  className='ml-2 h-5 w-5 animate-spin'
                />
              }
            <span className='flex-1'></span>
            <DropdownMenu>
              <DropdownMenuTrigger
                aria-label='More information'
                disabled={isSubmitting}
              >
                <EllipsisVertical className='w-5 h-5' aria-hidden='true' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={increasePosition}
                >
                  <ArrowUpWideNarrow
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Increase
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setIsDecreaseMenuOpen(true)}
                  disabled={position === undefined}
                >
                  <ArrowDownWideNarrow
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Decrease
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Information</DropdownMenuLabel>
                <DropdownMenuItem
                  onClick={() => openPositionDialog(position!.id)}
                  disabled={position === undefined}
                >
                  <ReceiptText
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Details
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveDialog('balances')}
                >
                  <Wallet
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Balances
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveDialog('positions')}
                >
                  <List
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Positions
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => setActiveDialog('transactions')}
                >
                  <ListChecks
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Transactions
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowLeftRight
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Strategy
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-x-4 gap-y-6 text-center'>

          {/* *******
            * ENTRY *
            ******* */}
          <div>
            <p>{entry}</p>
            <p className='text-light text-xs'>ENTRY</p>
          </div>

          {/* ******
            * GAIN *
            ****** */}
          <div>
            <p
              className={`${gainClassName} ${gain !== '0%' ? 'font-bold' : 'font-normal'}`}
            >{gain}</p>
            <p className='text-light text-xs'>GAIN</p>
          </div>

          {/* ********
            * AMOUNT *
            ******** */}
          <div>
            <p>{amount}</p>
            <p className='text-light text-xs'>AMOUNT</p>
          </div>

          {/* ***********
            * DECREASED *
            *********** */}
          <div>
            <p>{decreased}</p>
            <p className='text-light text-xs'>DECREASED</p>
          </div>

        </CardContent>
      </Card>



      {/* *********
        * DIALOGS *
        ********* */}
      {
        activeDialog === 'balances'
        && <BalancesDialog
          closeDialog={setActiveDialog}
        />
      }
      {
        activeDialog === 'positions'
        && <PositionsDialog
          closeDialog={setActiveDialog}
        />
      }
      {
        activeDialog === 'transactions'
        && <TransactionsDialog
          closeDialog={setActiveDialog}
        />
      }





      {/* **********************
        * DECREASE MENU DRAWER *
        ********************** */}
      <Drawer open={isDecreaseMenuOpen} onOpenChange={setIsDecreaseMenuOpen}>
        <DrawerContent>
          <div
            className='mx-auto w-full max-w-sm'
          >
            <DrawerHeader>
              <DrawerTitle>Decrease position</DrawerTitle>
              <DrawerDescription>Select a percentage</DrawerDescription>
            </DrawerHeader>
            <DrawerFooter
              className='grid grid-cols-3 sm:grid-cols-4 gap-1'
            >
              {
                decreaseMenu.map((item) => (
                  <Button
                    key={item.percentage}
                    variant='outline'
                    aria-label={`Decrease the position amount by ${item.percentage}%`}
                    className='flex flex-col h-20 w-full gap-y-1'
                    onClick={() => decreasePosition(item.percentage)}
                    disabled={item.amount === 0}
                  >
                    <p>{item.label}</p>
                    <p
                      className='text-light text-xs'
                    >{item.percentage}%</p>
                  </Button>
                ))
              }
            </DrawerFooter>
          </div>
        </DrawerContent>
      </Drawer>
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Position;
