import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { formatFileSize } from '@/shared/services/transformations/index.service.ts';
import { IDatabaseSummary } from '@/shared/backend/database/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * General Card Component
 * Component in charge of displaying general information regarding the database.
 */
const GeneralCard = ({ data }: { data: IDatabaseSummary }) => (
  <Card>
    <CardHeader>
      <CardTitle
        className='text-center text-base font-normal'
      >{data.version}</CardTitle>
    </CardHeader>
    <CardContent>
      <div
        className='flex justify-center items-center'
      >
        <p
          className='text-light text-sm'
        >Name</p>
        <span className='flex-1'></span>
        <p>{data.name}</p>
      </div>

      <div
        className='flex justify-center items-center mt-5'
      >
        <p
          className='text-light text-sm'
        >Port</p>
        <span className='flex-1'></span>
        <p>{data.port}</p>
      </div>

      <div
        className='flex justify-center items-center mt-5'
      >
        <p
          className='text-light text-sm'
        >Tables</p>
        <span className='flex-1'></span>
        <p>{data.tables.length}</p>
      </div>
      <div
        className='flex justify-center items-center mt-5'
      >
        <p
          className='text-light text-sm'
        >Size</p>
        <span className='flex-1'></span>
        <p>{formatFileSize(data.size)}</p>
      </div>
    </CardContent>
  </Card>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default GeneralCard;
