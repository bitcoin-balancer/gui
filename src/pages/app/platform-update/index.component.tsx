import { useState, useMemo, useCallback } from 'react';
import { SWService } from 'sw-service';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import {
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogContent,
} from '@/shared/shadcn/components/ui/dialog.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import Service from '@/pages/app/platform-update/service.component.tsx';
import { IServiceName } from '@/pages/app/platform-update/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Platform Update Component
 * Component in charge of ...
 */
const PlatformUpdate = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [open, setOpen] = useState<boolean>(false);
  const version = useBoundStore((state) => state.version!);




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // available service updates
  const availableUpdates = useMemo(() => VersionService.getAvailableUpdates(version), [version]);





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Determines the appropriate action in order the update the specified service.
   * @param service
   */
  const handleUpdateService = useCallback(
    (service: IServiceName): void => {
      if (service === 'GUI' && availableUpdates === 'GUI') {
        SWService.updateApp();
      } else {
        setOpen(true);
      }
    },
    [availableUpdates],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <div
        className='page-container flex justify-center items-start animate-in fade-in duration-700'
      >

        <section
          className='w-full sm:w-8/12 md:w-6/12 lg:w-5/12 xl:w-4/12 2xl:w-3/12'
        >

          <h1
            className='text-2xl font-semibold leading-none tracking-tight'
          >Platform update</h1>
          {
            availableUpdates !== null
            && <p
              className='text-light text-sm mt-2'
            >
                If you run into issues when updating the services, try
                <Button
                  variant='link'
                  className='p-0 m-0 ml-1 text-light'
                  onClick={() => setOpen(true)}
                >"Re-building the images"</Button>
            </p>
          }


          <Card className='md:mt-5'>

            <CardContent
              className='md:p-0'
            >

              <div
                className='py-4 px-4'
              >

                {/* *****
                  * GUI *
                  ***** */}
                <Service
                  service='GUI'
                  version={version.gui.latest}
                  availableUpdates={availableUpdates}
                  updateService={handleUpdateService}
                />


                <Separator className='my-7' />



                {/* *****
                  * API *
                  ***** */}
                <Service
                  service='API'
                  version={version.api.latest}
                  availableUpdates={availableUpdates}
                  updateService={handleUpdateService}
                />

              </div>

            </CardContent>

          </Card>

        </section>

      </div>



      {/* ******************************
        * PLATFORM UPDATE INSTRUCTIONS *
        ****************************** */}
      <Dialog
        open={open}
        onOpenChange={setOpen}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update platform</DialogTitle>
            <DialogDescription>
              Enjoy the latest innovations, bug fixes, and enhanced security
            </DialogDescription>
          </DialogHeader>

          <p>
            1. Navigate to the Balancer CLI directory:
          </p>

          <code
            className='p-5 bg-slate-900 text-slate-50 rounded-lg'
          >$ cd balancer/cli</code>

          <p className='mt-3'>2. Start the Balancer CLI:</p>

          <code
            className='p-5 bg-slate-900 text-slate-50 rounded-lg'
          >$ npm start</code>

          <p className='mt-3'>
            3. Select the <strong>"Docker Compose"</strong> menu and execute the following action
            on the <strong>remote host</strong>:
          </p>

          <code
            className='p-5 bg-slate-900 text-slate-50 rounded-lg'
          >down-build-up</code>

          <p
            className='text-light text-sm'
          >
            The action will pull the latest images from the registry (Docker Hub), build them,
            (re)create and start the containers.
          </p>

        </DialogContent>
      </Dialog>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PlatformUpdate;
