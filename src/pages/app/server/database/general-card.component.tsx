import { useMemo } from 'react';
import { prettifyFileSize } from 'web-utils-kit';
import { calculateSum } from 'bignumber-utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/shared/shadcn/components/ui/card.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { IDatabaseSummary } from '@/shared/backend/database/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * General Card Component
 * Component in charge of displaying general information regarding the database.
 */
const GeneralCard = ({ data }: { data: IDatabaseSummary }) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the size of all the tables combined
  const tablesSize = useMemo(
    () => prettifyFileSize(calculateSum(data.tables.map((table) => table.size))),
    [data.tables],
  );

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card className="animate-in fade-in duration-700">
      <CardHeader>
        <CardTitle className="text-center text-base font-normal break-all">
          {data.version}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-center items-center">
          <p className="text-light text-sm">Name</p>
          <span className="flex-1"></span>
          <Badge
            className="text-sm"
            variant="secondary"
          >
            {data.name}
          </Badge>
        </div>

        <div className="flex justify-center items-center mt-5">
          <p className="text-light text-sm">Port</p>
          <span className="flex-1"></span>
          <Badge
            className="text-sm"
            variant="secondary"
          >
            {data.port}
          </Badge>
        </div>

        <div className="flex justify-center items-center mt-5">
          <p className="text-light text-sm">Tables</p>
          <span className="flex-1"></span>
          <p>{data.tables.length}</p>
        </div>

        <div className="flex justify-center items-center mt-5">
          <p className="text-light text-sm">Tables' size</p>
          <span className="flex-1"></span>
          <p>{tablesSize}</p>
        </div>

        <div className="flex justify-center items-center mt-5">
          <p className="text-light text-sm">Database's Size</p>
          <span className="flex-1"></span>
          <p>
            <strong>{prettifyFileSize(data.size)}</strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default GeneralCard;
