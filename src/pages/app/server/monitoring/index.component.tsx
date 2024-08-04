import {
  CodeXml,
  ExternalLink,
  Github,
  Ellipsis,
} from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../../../shared/shadcn/components/ui/badge.tsx';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../../../shared/shadcn/components/ui/card.tsx';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../../../../shared/shadcn/components/ui/dialog.tsx';
import { ENVIRONMENT } from '../../../../environment/environment.ts';
import { formatDate, formatFileSize } from '../../../../shared/services/transformations/index.service.ts';
import { NavService } from '../../../../shared/services/nav/index.service.ts';
import { buildAPIURL } from '../../../../shared/backend/api/index.service.ts';
import { ServerService, IServerState } from '../../../../shared/backend/server/index.service.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';
import ResourcePieChart from './resource-pie-chart.component.tsx';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// API's ping url
const API_URL = buildAPIURL('ping');




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Monitoring Component
 * Component in charge of displaying the current state of the server.
 */
const Monitoring = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const { data, loading, error } = useAPIRequest<IServerState>(ServerService.getState);



  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (error) {
    return <PageLoadError error={error} />;
  }
  if (loading) {
    return <PageLoader />;
  }
  return (
    <div className='page-container flex justify-center items-start animate-in fade-in duration-700'>
      <section className='w-full lg:w-10/12 xl:w-8/12 2xl:w-7/12'>

        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15'>

          {/* MAIN CARD */}
          <Card className='w-full'>
            <div className='flex justify-start items-start p-6'>
              <div>
                <div className='flex justify-start items-center'>
                  <img src='/logo/logo-dark.png' alt='Balancer’s Logo' width='80' height='30' className='w-20' />
                  <Badge variant='secondary' className='ml-2'>API</Badge>
                </div>
                <div className='text-left'>
                  <Button variant='link' className='justify-start p-0 -mt-6 text-light text-xs'>
                    <CodeXml className='mr-1 w-4 h-4' /> v1.0.0 · 0a23ed6 · last month
                  </Button>
                </div>
              </div>
              <span className='flex-1'></span>
              <Button variant='ghost' size='icon' aria-label='Open the API’s repository in a new tab' onClick={() => NavService.openAPIRepo()}><Github aria-hidden='true' /></Button>
            </div>

            <CardContent>
              <div className='flex justify-start items-center'>
                <p className='text-light text-sm'>Uptime</p>
                <span className='flex-1'></span>
                <p>{Math.ceil((data.uptime / 60) / 60)} hours</p>
              </div>
              <div className='flex justify-start items-center mt-3'>
                <p className='text-light text-sm'>URL</p>
                <span className='flex-1'></span>
                <a href={API_URL} target='_black' rel='noopener noreferrer' className='flex justify-start items-center' aria-label='Open the API on a new tab'>
                <p className='max-w-36 lg:max-w-44 xl:max-w-none truncate'>{ENVIRONMENT.apiURL}</p> <ExternalLink aria-hidden='true' className='w-4 h-4 ml-1' />
                </a>
              </div>
              <div className='flex justify-start items-center mt-3'>
                <p className='text-light text-sm'>Environment</p>
                <span className='flex-1'></span>
                <p>{data.environment}</p>
              </div>
              <div className='flex justify-start items-center mt-3 text-ellipsis overflow-hidden'>
                <p className='text-light text-sm'>Last scan</p>
                <span className='flex-1'></span>
                <p className='max-w-32 lg:max-w-44 xl:max-w-none truncate'>{formatDate(data.refetchTime, 'datetime-short')}</p>
              </div>
            </CardContent>
          </Card>

          {/* MEMORY CARD */}
          <Card className='w-full'>
            <CardHeader className='flex flex-row justify-start items-center pb-0'>
              <CardTitle>Memory</CardTitle>
              <span className='flex-1'></span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='ghost' size='icon'><Ellipsis aria-hidden='true' /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Memory</DialogTitle>
                    <DialogDescription>
                      Current state of the server's Virtual Memory (RAM)
                    </DialogDescription>
                  </DialogHeader>

                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Total</p>
                    <span className='flex-1'></span>
                    <p><strong>{formatFileSize(data.memory.total)}</strong></p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Free</p>
                    <span className='flex-1'></span>
                    <p>{formatFileSize(data.memory.free)}</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Active</p>
                    <span className='flex-1'></span>
                    <p>{formatFileSize(data.memory.active)}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <ResourcePieChart valueLabel='Usage%' value={data.memory.usage} />

          </Card>

        </div>


        {/* CPU CARD */}
        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 2xl:gap-15 mt-5 lg:mt-10 2xl:mt-15'>
          <Card className='w-full'>
          <CardHeader className='flex flex-row justify-start items-center pb-0'>
              <CardTitle>CPU</CardTitle>
              <span className='flex-1'></span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='ghost' size='icon'><Ellipsis aria-hidden='true' /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>CPU</DialogTitle>
                    <DialogDescription>
                      Current state of the server's Core Processing Unit (CPU)
                    </DialogDescription>
                  </DialogHeader>

                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Average Load</p>
                    <span className='flex-1'></span>
                    <p>{data.cpu.avgLoad}%</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Current Load</p>
                    <span className='flex-1'></span>
                    <p><strong>{data.cpu.currentLoad}%</strong></p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Current Load (User)</p>
                    <span className='flex-1'></span>
                    <p>{data.cpu.currentLoadUser}%</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Current Load (System)</p>
                    <span className='flex-1'></span>
                    <p>{data.cpu.currentLoadSystem}%</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <ResourcePieChart valueLabel='Load%' value={data.cpu.avgLoad > data.cpu.currentLoad ? data.cpu.avgLoad : data.cpu.currentLoad} />

          </Card>


          {/* FILESYSTEM CARD */}
          <Card className='w-full'>
            <CardHeader className='flex flex-row justify-start items-center pb-0'>
              <CardTitle>File System</CardTitle>
              <span className='flex-1'></span>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant='ghost' size='icon'><Ellipsis aria-hidden='true' /></Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>File System</DialogTitle>
                    <DialogDescription>
                      Current state of the server's File System
                    </DialogDescription>
                  </DialogHeader>

                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>FS</p>
                    <span className='flex-1'></span>
                    <p>{data.fileSystem.fs}</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Mount</p>
                    <span className='flex-1'></span>
                    <p>{data.fileSystem.mount}</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Type</p>
                    <span className='flex-1'></span>
                    <p>{data.fileSystem.type}</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Size</p>
                    <span className='flex-1'></span>
                    <p><strong>{formatFileSize(data.fileSystem.size)}</strong></p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Used</p>
                    <span className='flex-1'></span>
                    <p>{formatFileSize(data.fileSystem.used)}</p>
                  </div>
                  <div className='flex justify-center items-center'>
                    <p className='text-light text-sm'>Available</p>
                    <span className='flex-1'></span>
                    <p>{formatFileSize(data.fileSystem.available)}</p>
                  </div>
                </DialogContent>
              </Dialog>
            </CardHeader>

            <ResourcePieChart valueLabel='Usage%' value={data.fileSystem.use} />

          </Card>
        </div>

      </section>
    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Monitoring;
