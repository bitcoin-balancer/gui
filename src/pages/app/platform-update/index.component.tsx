import { useState, useMemo } from 'react';
import { CodeXml, CloudDownload, BadgeCheck } from 'lucide-react';
import { SWService } from 'sw-service';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';

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
  const handleUpdateService = (service: 'GUI' | 'API'): void => {
    if (service === 'GUI' && availableUpdates === 'GUI') {
      SWService.updateApp();
    }
  };





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
            className='text-2xl md:text-3xl'
          >Platform update</h1>
          <p
            className='text-light text-sm mt-2'
            >
              If you run into issues when updating the services, try
              <Button
                variant='link'
                className='p-0 m-0 ml-1 text-light'>"Re-building the images"</Button>
            </p>


          <Card className='mt-5'>

            <CardContent
              className='p-0'
            >

              <div
                className='py-4 px-4'
              >

                {/* *****
                  * GUI *
                  ***** */}
                <div
                  className='flex justify-start items-center'
                >

                  <div
                    className='max-w-[70%] sm:max-w-[65%]'
                  >
                    <div
                      className='flex justify-start items-center'
                    >
                      <img
                        src='/logo/logo-dark.png'
                        alt='Balancer’s Logo'
                        width='80'
                        height='30'
                        className='w-20'
                      />
                      <Badge
                        variant='secondary'
                        className='ml-2'
                      >GUI</Badge>
                    </div>

                    <a
                      href={NavService.buildGUICommitURL(version.gui.latest.sha)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex justify-start items-center mt-2 text-sm text-light'
                    >
                      <CodeXml
                          className='mr-1 w-4 h-4'
                      />
                      <p
                        className='truncate'
                      >
                        v{version.gui.latest.version}&nbsp;·&nbsp;
                        {version.gui.latest.sha.slice(0, 7)}&nbsp;·&nbsp;
                        {formatDate(version.gui.latest.eventTime, 'date-short')}
                      </p>
                    </a>
                  </div>

                  <span className='flex-1'></span>

                  {
                    (availableUpdates !== 'GUI' && availableUpdates !== 'BOTH')
                      ? <Tooltip>
                        <TooltipTrigger className='flex justify-start text-success text-sm'>
                          <BadgeCheck
                            aria-hidden='true'
                            className='mr-1 w-5 h-5'
                          /> <span className='hidden sm:inline'>Up to date</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The GUI service is up to date</p>
                        </TooltipContent>
                      </Tooltip>
                      : <Button
                        variant='ghost'
                        aria-label='Update application'
                        onClick={() => handleUpdateService('GUI')}
                      >
                        <CloudDownload aria-hidden='true' />
                        <span
                          className='ml-2 hidden sm:inline'
                        >Update</span>
                      </Button>
                  }
                </div>


                <Separator className='my-7' />



                {/* *****
                  * API *
                  ***** */}
                <div
                  className='flex justify-start items-center'
                >

                  <div
                    className='max-w-[70%] sm:max-w-[65%]'
                  >
                    <div
                      className='flex justify-start items-center'
                    >
                      <img
                        src='/logo/logo-dark.png'
                        alt='Balancer’s Logo'
                        width='80'
                        height='30'
                        className='w-20'
                      />
                      <Badge
                        variant='secondary'
                        className='ml-2'
                      >API</Badge>
                    </div>

                    <a
                      href={NavService.buildAPICommitURL(version.api.latest.sha)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex justify-start items-center mt-2 text-sm text-light'
                    >
                      <CodeXml
                          className='mr-1 w-4 h-4'
                      />
                      <p
                        className='truncate'
                      >
                        v{version.api.latest.version}&nbsp;·&nbsp;
                        {version.api.latest.sha.slice(0, 7)}&nbsp;·&nbsp;
                        {formatDate(version.api.latest.eventTime, 'date-short')}
                      </p>
                    </a>
                  </div>

                  <span className='flex-1'></span>

                  {
                    (availableUpdates !== 'API' && availableUpdates !== 'BOTH')
                      ? <Tooltip>
                        <TooltipTrigger className='flex justify-start text-success text-sm'>
                          <BadgeCheck
                            aria-hidden='true'
                            className='mr-1 w-5 h-5'
                          /> <span className='hidden sm:inline'>Up to date</span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>The API service is up to date</p>
                        </TooltipContent>
                      </Tooltip>
                      : <Button
                        variant='ghost'
                        aria-label='Update API'
                        onClick={() => handleUpdateService('API')}
                      >
                        <CloudDownload aria-hidden='true' />
                        <span
                          className='ml-2 hidden sm:inline'
                        >Update</span>
                      </Button>
                  }
                </div>

              </div>

            </CardContent>

          </Card>

        </section>

      </div>
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PlatformUpdate;
