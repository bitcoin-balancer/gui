import { memo } from 'react';
import { Ellipsis } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { IMemoryState } from '@/shared/backend/server/types.ts';
import { formatFileSize } from '@/shared/services/transformers/index.service.ts';
import ResourcePieChart from '@/pages/app/server/monitoring/resource-pie-chart.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Memory Card Component
 * Component in charge of displaying information regarding the current state of the RAM.
 */
const MemoryCard = memo(({ data }: { data: IMemoryState }) => (
  <Card
    className='flex-1 w-full'
  >
    <CardHeader
      className='flex flex-row justify-start items-center pb-0'
    >
      <CardTitle
        className='text-xl'
      >Memory</CardTitle>
      <span className='flex-1'></span>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
          ><Ellipsis aria-hidden='true' /></Button>
        </DialogTrigger>
        <DialogContent className='max-w-[350px]'>
          <DialogHeader>
            <DialogTitle>Memory</DialogTitle>
            <DialogDescription>
              Current state of the server's Virtual Memory (RAM)
            </DialogDescription>
          </DialogHeader>

          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Total</p>
            <span className='flex-1'></span>
            <p><strong>{formatFileSize(data.total)}</strong></p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Free</p>
            <span className='flex-1'></span>
            <p>{formatFileSize(data.free)}</p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Active</p>
            <span className='flex-1'></span>
            <p>{formatFileSize(data.active)}</p>
          </div>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardContent>
      <ResourcePieChart
        valueLabel='Usage%'
        value={data.usage}
      />
    </CardContent>

  </Card>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default MemoryCard;
