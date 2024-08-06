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
import { ICPUState } from '@/shared/backend/server/types.ts';
import ResourcePieChart from '@/pages/app/server/monitoring/resource-pie-chart.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * CPU Card Component
 * Component in charge of displaying information regarding the current state of the CPU.
 */
const CPUCard = ({ data }: { data: ICPUState }) => (
  <Card
    className='w-full'
  >
    <CardHeader
      className='flex flex-row justify-start items-center pb-0'
    >
      <CardTitle
        className='text-xl'
      >CPU</CardTitle>
      <span className='flex-1'></span>
      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant='ghost'
            size='icon'
          ><Ellipsis aria-hidden='true' /></Button>
        </DialogTrigger>
        <DialogContent
          className='max-h-dvh overflow-y-auto overflow-x-hidden'
        >
          <DialogHeader>
            <DialogTitle>CPU</DialogTitle>
            <DialogDescription>
              Current state of the server's Core Processing Unit (CPU)
            </DialogDescription>
          </DialogHeader>

          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Average Load</p>
            <span className='flex-1'></span>
            <p>{data.avgLoad}%</p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Current Load</p>
            <span className='flex-1'></span>
            <p><strong>{data.currentLoad}%</strong></p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Current Load (User)</p>
            <span className='flex-1'></span>
            <p>{data.currentLoadUser}%</p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Current Load (System)</p>
            <span className='flex-1'></span>
            <p>{data.currentLoadSystem}%</p>
          </div>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardContent>
      <ResourcePieChart
        valueLabel='Load%'
        value={data.avgLoad > data.currentLoad ? data.avgLoad : data.currentLoad}
      />
    </CardContent>

  </Card>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default CPUCard;
