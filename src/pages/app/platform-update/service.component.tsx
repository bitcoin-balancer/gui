import { memo, useMemo } from 'react';
import { CodeXml, CloudDownload, BadgeCheck } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { IServiceComponentProps } from '@/pages/app/platform-update/types.ts';


/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Service Component
 * Component in charge of displaying the current release state for a service.
 */
const Service = memo(({
  service,
  version,
  availableUpdates,
  updateService,
}: IServiceComponentProps) => {
  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // info regarding the running version
  const lastCommit = useMemo(
    () => VersionService.buildLastCommitText(version),
    [version],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <article
      className='flex justify-start items-center'
    >

      <div
        className='max-w-[75%] sm:max-w-[70%]'
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
          >{service}</Badge>
        </div>

        <a
          href={
            service === 'GUI'
              ? NavService.buildGUICommitURL(version.sha)
              : NavService.buildAPICommitURL(version.sha)
          }
          target='_blank'
          rel='noopener noreferrer'
          className='flex justify-start items-center mt-2 text-sm text-light p-0'
          style={{ marginTop: 3 }}
        >
          <CodeXml
              className='mr-1 w-4 h-4 min-w-5'
          />
          <p
            className='truncate'
          >{lastCommit}</p>
        </a>
      </div>

      <span className='flex-1'></span>

      {
        (availableUpdates !== service && availableUpdates !== 'BOTH')
          ? <Tooltip>
            <TooltipTrigger className='flex justify-start text-success text-sm'>
              <BadgeCheck
                aria-hidden='true'
                className='mr-1 w-5 h-5'
              /> <span className='hidden sm:inline'>Up to date</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>The {service} service is up to date</p>
            </TooltipContent>
          </Tooltip>
          : <>
            <Button
              className='sm:hidden'
              variant='ghost'
              size='icon'
              aria-label='Update application'
              onClick={() => updateService(service)}
            >
              <CloudDownload
                aria-hidden='true'
                className='w-5 h-5'
              />
            </Button>
            <Button
              className='hidden sm:flex'
              variant='ghost'
              aria-label='Update application'
              onClick={() => updateService(service)}
            >
              <CloudDownload
                aria-hidden='true'
                className='w-5 h-5 mr-2'
              /> Update
            </Button>
          </>
      }
    </article>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Service;
