import { useMemo } from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/shared/shadcn/components/ui/table.tsx';
import { Progress } from '@/shared/shadcn/components/ui/progress.tsx';
import { formatBitcoinAmount, formatDollarAmount } from '@/shared/services/transformers/index.service.ts';
import {
  ILiquiditySideID,
  ILiquiditySide,
  ILiquidityIntensity,
} from '@/shared/backend/market-state/liquidity/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Calculates the percentage representation of the total liquidity for a price level based on its
 * intensity.
 * @param intensity
 * @returns number
 */
const calculatePercentageRepresentation = (intensity: ILiquidityIntensity): number => {
  switch (intensity) {
    case 4:
      return 100;
    case 3:
      return 75;
    case 2:
      return 50;
    case 1:
      return 25;
    default:
      return 0;
  }
};



/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Price Levels Component
 * Component in charge of displaying the price levels for a liquidity side.
 */
const PriceLevels = ({ id, side }: { id: ILiquiditySideID, side: ILiquiditySide }) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the list of processed price levels
  const priceLevels = useMemo(
    () => side.levels.map((level) => ({
      price: formatDollarAmount(level[0]),
      intensity: level[2],
      liquidity: formatBitcoinAmount(level[1], 3),
      share: calculatePercentageRepresentation(level[2]),
      color: id === 'bids' ? ColorService.INCREASE_0 : ColorService.DECREASE_0,
    })),
    [id, side],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Table className='pt-0'>
      <TableCaption>A list of {id}.</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Price</TableHead>
          <TableHead>Intensity</TableHead>
          <TableHead className='text-right'>
            <span className='hidden sm:inline'>Liquidity</span>
            <span className='sm:hidden'>Liq.</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priceLevels.map((level) => (
          <TableRow
            key={level.price}
            className='hover:contrast-115'
          >
            <TableCell
              className='font-medium'
            >{level.price}</TableCell>
            <TableCell>
              <Progress
                className={id === 'bids' ? '[&>*]:bg-increase-1' : '[&>*]:bg-decrease-1'}
                value={level.share}
              />
            </TableCell>
            <TableCell className='text-right'>{level.liquidity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PriceLevels;
