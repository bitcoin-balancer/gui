import { useMemo, memo } from 'react';
import {
  EllipsisVertical,
  UserPen,
  UserMinus,
  RectangleEllipsis,
  KeyRound,
  SquareAsterisk,
} from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';
import { Badge } from '../../../shared/shadcn/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../../../shared/shadcn/components/ui/dropdown-menu.tsx';
import { TableCell, TableRow } from '../../../shared/shadcn/components/ui/table.tsx';
import { formatDate } from '../../../shared/services/transformations/index.service.ts';
import { IBreakpoint } from '../../../shared/services/media-query/index.service.ts';
import useMediaQueryBreakpoint from '../../../shared/hooks/media-query-breakpoint/index.hook.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Formats a date based on the current media query breakpoint.
 * @param date
 * @param breakpoint
 * @returns string
 */
const formatDateByBreakpoint = (date: number, breakpoint: IBreakpoint): string => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
      return formatDate(date, 'date-short');
    case 'md':
      return formatDate(date, 'date-medium');
    default:
      return formatDate(date, 'date-long');
  }
};


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * User Row Component
 * Component in charge of display the user's details and the actions menu.
 */
const UserRow = memo(() => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */
  const creation = useMemo(() => formatDateByBreakpoint(1721076422954, breakpoint), [breakpoint]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <TableRow>
      <TableCell>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant='ghost' size='sm' className='max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-36 2xl:max-w-40'>
              <p className='text-ellipsis overflow-hidden font-bold'>6234ca63-426e-472c-9440-5e0b30640a5f</p>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Click to copy</p>
          </TooltipContent>
        </Tooltip>
      </TableCell>
      <TableCell>
        <p className='font-bold'>root</p>
      </TableCell>
      <TableCell>
        <Badge variant='secondary'>5</Badge>
      </TableCell>
      <TableCell>
        <p>{creation}</p>
      </TableCell>
      <TableCell>
        <DropdownMenu>
          <DropdownMenuTrigger aria-label='User actions menu'><EllipsisVertical aria-hidden='true'/></DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuLabel>root</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update nickname</DropdownMenuItem>
            <DropdownMenuItem><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update authority</DropdownMenuItem>
            <DropdownMenuItem><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update OTP secret</DropdownMenuItem>
            <DropdownMenuItem><UserMinus aria-hidden='true' className='w-5 h-5 mr-1' /> Delete user</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem><RectangleEllipsis aria-hidden='true' className='w-5 h-5 mr-1' /> Display OTP secret</DropdownMenuItem>
            <DropdownMenuItem><KeyRound aria-hidden='true' className='w-5 h-5 mr-1' /> Display auth sessions</DropdownMenuItem>
            <DropdownMenuItem><SquareAsterisk aria-hidden='true' className='w-5 h-5 mr-1' /> Display password updates</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default UserRow;
