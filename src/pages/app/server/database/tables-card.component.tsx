import { Fragment, useMemo } from 'react';
import { calculatePercentageRepresentation } from 'bignumber-utils';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { formatFileSize } from '@/shared/services/transformations/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IDatabaseSummary } from '@/shared/backend/database/index.service.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Tables Card Component
 * Component in charge of displaying the existing tables as well as their size.
 */
const TablesCard = ({ data }: { data: IDatabaseSummary }) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the total space used by each table
  const tablesTotalSize = useMemo(
    () => data.tables.reduce((previous, current) => previous + current.size, 0),
    [data],
  );

  // the % of the database each table is occupying
  const percentageRepresentations = useMemo(
    () => data.tables.map(
      (table) => calculatePercentageRepresentation(table.size, tablesTotalSize),
    ),
    [data, tablesTotalSize],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card>
      <CardContent className='p-0'>
        {data.tables.map((item, i) => (
          <Fragment key={item.name}>
            <div
              className='flex justify-start items-center py-4 px-2'
              style={{
                background: `linear-gradient(90deg, ${ColorService.SLATE.H100} ${percentageRepresentations[i]}%, #FFFFFF ${percentageRepresentations[i]}%)`,
              }}
            >
              <p>{item.name}</p>
              <span className='flex-1'></span>
              <p
                className='text-light text-sm'
              >{formatFileSize(item.size)}</p>
            </div>
            {(i < data.tables.length - 1) && <Separator />}
          </Fragment>
        ))}
      </CardContent>
    </Card>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default TablesCard;
