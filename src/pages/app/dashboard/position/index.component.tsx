import { EllipsisVertical } from 'lucide-react';
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

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Component
 * Component in charge of displaying information regarding the active position (if any)
 */
// eslint-disable-next-line arrow-body-style
const Position = () => {
  return (
    <>
      <Card className='md:mt-2.5 lg:mt-0'>
        <CardHeader>
          <CardTitle className='flex justify-start items-center'>

            Position

            <span className='flex-1'></span>

            <DropdownMenu>
              <DropdownMenuTrigger>
                <EllipsisVertical className='w-5 h-5' aria-hidden='true' />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Billing</DropdownMenuItem>
                <DropdownMenuItem>Team</DropdownMenuItem>
                <DropdownMenuItem>Subscription</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardTitle>
        </CardHeader>
        <CardContent className='grid grid-cols-2 gap-4 text-center'>

          {/* ******
            * SIZE *
            ****** */}
          <div>
            <p>0.0361 BTC</p>
            <p className='text-light text-xs'>~2,205.75 USDT</p>
          </div>

          {/* *********
            * REDUCED *
            ********* */}
          <div>
            <p>783.61 USDT</p>
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
            <p>$61,588.55</p>
            <p className='text-light text-xs'>ENTRY</p>
          </div>

        </CardContent>
      </Card>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Position;
