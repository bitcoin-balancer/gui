import { memo } from 'react';
import { Ellipsis } from 'lucide-react';
import { prettifyFileSize } from 'web-utils-kit';
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
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { IFileSystemState } from '@/shared/backend/server/types.ts';
import ResourcePieChart from '@/pages/app/server/monitoring/resource-pie-chart.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * File System Card Component
 * Component in charge of displaying information regarding the current state of the File System.
 */
const FileSystemCard = memo(({ data }: { data: IFileSystemState }) => (
  <Card
    className='flex-1 w-full'
  >
    <CardHeader
      className='flex flex-row justify-start items-center pb-0'
    >
      <CardTitle
        className='text-xl'
      >File System</CardTitle>
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
            <DialogTitle>File System</DialogTitle>
            <DialogDescription>
              Current state of the server's File System
            </DialogDescription>
          </DialogHeader>

          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >FS</p>
            <span className='flex-1'></span>
            <Badge variant='secondary'>{data.fs}</Badge>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Mount</p>
            <span className='flex-1'></span>
            <Badge variant='secondary'>{data.mount}</Badge>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Type</p>
            <span className='flex-1'></span>
            <Badge variant='secondary'>{data.type}</Badge>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Size</p>
            <span className='flex-1'></span>
            <p><strong>{prettifyFileSize(data.size)}</strong></p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Used</p>
            <span className='flex-1'></span>
            <p>{prettifyFileSize(data.used)}</p>
          </div>
          <div
            className='flex justify-center items-center'
          >
            <p
              className='text-light text-sm'
            >Available</p>
            <span className='flex-1'></span>
            <p>{prettifyFileSize(data.available)}</p>
          </div>
        </DialogContent>
      </Dialog>
    </CardHeader>

    <CardContent>
      <ResourcePieChart
        valueLabel='Usage%'
        value={data.use}
      />
    </CardContent>

  </Card>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default FileSystemCard;
