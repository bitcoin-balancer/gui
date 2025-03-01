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
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/shared/shadcn/components/ui/tabs.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import Code from '@/shared/components/code/index.component.tsx';
import CodeSnippet from '@/shared/components/code-snippet/index.component.tsx';
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
                If you run into issues when updating the services, read
                <Button
                  variant='link'
                  className='p-0 m-0 ml-1 text-light'
                  onClick={() => setOpen(true)}
                ><strong>this</strong></Button> guide
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

          <Tabs
            defaultValue='CLI-LITE'
            className='w-full'
          >
            <TabsList
              className='grid w-full grid-cols-2'
            >
              <TabsTrigger value='CLI-LITE'>CLI-LITE</TabsTrigger>
              <TabsTrigger value='CLI'>CLI</TabsTrigger>
            </TabsList>

            {/* **********
              * CLI-LITE *
              ********** */}
            <TabsContent
              value='CLI-LITE'
              className='animate-in fade-in duration-500'
            >
              <p
                className='mt-3 mb-2'
              >
                1. Connect to your virtual machine (Droplet).
              </p>

              <p
                className='mt-5 mb-2'
              >
                2. Navigate to the <Code>CLI-LITE</Code>'s directory:
              </p>
              <CodeSnippet
                code='cd ~/cli-lite'
                isCommand={true}
                canBeCopied={true}
              />

              <p className='mt-5 mb-2'>3. Start the <Code>CLI-LITE</Code>:</p>
              <CodeSnippet
                code='npm start'
                isCommand={true}
                canBeCopied={true}
              />

              <p className='mt-5 mb-2'>
                4. Select the <strong>"Docker"</strong> menu and execute the following
                 action:
              </p>
              <CodeSnippet code='down-up' />

              <p
                className='text-light text-sm mt-2'
              >
                The action will pull the latest images from the registry (Docker Hub), build them,
                (re)create and start the containers.
              </p>

            </TabsContent>



            {/* *****
              * CLI *
              ***** */}
            <TabsContent
              value='CLI'
              className='animate-in fade-in duration-500'
            >

              <p
                className='mt-3 mb-2'
              >
                1. Navigate to the <Code>CLI</Code>'s directory:
              </p>
              <CodeSnippet
                code='cd balancer/cli'
                isCommand={true}
                canBeCopied={true}
              />

              <p className='mt-5 mb-2'>2. Start the <Code>CLI</Code>:</p>
              <CodeSnippet
                code='npm start'
                isCommand={true}
                canBeCopied={true}
              />

              <p className='mt-5 mb-2'>
                3. Select the <strong>"Docker Compose"</strong> menu and execute the following
                 action on the <strong>remote host</strong>:
              </p>
              <CodeSnippet code='down-build-up' />

              <p
                className='text-light text-sm mt-2'
              >
                The action will pull the latest images from the registry (Docker Hub), build them,
                (re)create and start the containers.
              </p>

            </TabsContent>

          </Tabs>

        </DialogContent>
      </Dialog>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PlatformUpdate;
