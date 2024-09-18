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
} from 'lucide-react';
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
  formatBitcoinAmount,
  formatDollarAmount,
  formatPercentageChange,
} from '@/shared/services/transformers/index.service.ts';
import { ICompactPosition, PositionService } from '@/shared/backend/position/index.service.ts';
import BalancesDialog from '@/pages/app/dashboard/position/balances/index.component.tsx';

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
  const [activeDialog, setActiveDialog] = useState<'balances'>();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // main position details
  const entry = useMemo(
    () => (position === undefined ? '$0' : formatDollarAmount(position.entry_price, 0)),
    [position],
  );
  const gain = useMemo(
    () => (position === undefined ? '0%' : formatPercentageChange(position.gain, 0)),
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
            <span className='flex-1'></span>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label='More information'>
                <EllipsisVertical className='w-5 h-5' aria-hidden='true' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                <DropdownMenuItem>
                  <ArrowUpWideNarrow
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Increase
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <ArrowDownWideNarrow
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Decrease
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Information</DropdownMenuLabel>
                <DropdownMenuItem>
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
                <DropdownMenuItem>
                  <List
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Positions
                </DropdownMenuItem>
                <DropdownMenuItem>
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
            <p className={`${gainClassName} font-bold`}>{gain}</p>
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
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Position;
