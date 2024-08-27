import { ICompactCandlestickRecords } from '@/shared/backend/candlestick/index.service.ts';
import { ISplitStateItem } from '@/shared/backend/market-state/shared/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Converts a compact candlestick records object into a list of split state items.
 * @param records
 * @returns ISplitStateItem[]
 */
const toSplitStateItems = (records: ICompactCandlestickRecords): ISplitStateItem[] => (
  records.id.reduce(
    (prev, current, idx) => [...prev, { x: current, y: records.close[idx] }],
    [] as ISplitStateItem[],
  )
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  toSplitStateItems,
};
