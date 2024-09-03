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
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
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
      return 5;
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
      liquidity: formatBitcoinAmount(level[1], 6),
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
          <TableHead
            className='hidden sm:table-cell'
          >Intensity</TableHead>
          <TableHead className='text-right'>Liquidity</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {priceLevels.map((level) => (
          <TableRow
            key={level.price}
            className='border-none hover:contrast-75'
            style={{
              background: `linear-gradient(90deg, ${level.color} ${level.share}%, #FFFFFF ${level.share}%)`,
            }}
          >
            <TableCell
              className='font-medium'
            >{level.price}</TableCell>
            <TableCell
              className='hidden sm:table-cell'
            >
              <Badge
                variant='secondary'
              >{level.intensity}/4</Badge>
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
