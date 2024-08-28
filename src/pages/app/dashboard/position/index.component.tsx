import { memo } from 'react';
import {
  EllipsisVertical,
  ArrowLeftRight,
  ArrowUpWideNarrow,
  ArrowDownWideNarrow,
  ReceiptText,
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
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Component
 * Component in charge of displaying information regarding the active position (if any)
 */
// eslint-disable-next-line arrow-body-style
const Position = memo(() => {
  return (
    <>
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
                <DropdownMenuGroup>
                  <DropdownMenuSub>
                    <DropdownMenuSubTrigger>
                      <ArrowDownWideNarrow
                          aria-hidden='true'
                          className='mr-1 h-5 w-5'
                        /> Reduce
                    </DropdownMenuSubTrigger>
                    <DropdownMenuPortal>
                      <DropdownMenuSubContent>
                        <DropdownMenuItem>100%</DropdownMenuItem>
                        <DropdownMenuItem>75%</DropdownMenuItem>
                        <DropdownMenuItem>66%</DropdownMenuItem>
                        <DropdownMenuItem>50%</DropdownMenuItem>
                        <DropdownMenuItem>33%</DropdownMenuItem>
                        <DropdownMenuItem>25%</DropdownMenuItem>
                        <DropdownMenuItem>15%</DropdownMenuItem>
                      </DropdownMenuSubContent>
                    </DropdownMenuPortal>
                  </DropdownMenuSub>
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuLabel>Information</DropdownMenuLabel>
                <DropdownMenuItem>
                  <ReceiptText
                      aria-hidden='true'
                      className='mr-1 h-5 w-5'
                    /> Details
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

          {/* ******
            * SIZE *
            ****** */}
          <div>
            <p>0.0361 BTC</p>
            <p className='text-light text-xs'>~2,205 USDT</p>
          </div>

          {/* *********
            * REDUCED *
            ********* */}
          <div>
            <p>783 USDT</p>
            <p className='text-light text-xs'>REDUCED</p>
          </div>

          {/* ******
            * GAIN *
            ****** */}
          <div>
            <p className='text-increase-1 font-bold'>+2.85%</p>
            <p className='text-light text-xs'>GAIN</p>
          </div>

          {/* *******
            * ENTRY *
            ******* */}
          <div>
            <p>$61,588</p>
            <p className='text-light text-xs'>ENTRY</p>
          </div>

        </CardContent>
      </Card>
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Position;
