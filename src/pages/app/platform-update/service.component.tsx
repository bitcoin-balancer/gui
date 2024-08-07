import { memo } from 'react';
import { CodeXml, CloudDownload, BadgeCheck } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
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
}: IServiceComponentProps) => (
  <article
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
        className='flex justify-start items-center mt-2 text-sm text-light'
      >
        <CodeXml
            className='mr-1 w-4 h-4'
        />
        <p
          className='truncate'
        >
          v{version.version}&nbsp;·&nbsp;
          {version.sha.slice(0, 7)}&nbsp;·&nbsp;
          {formatDate(version.eventTime, 'date-short')}
        </p>
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
        : <Button
          variant='ghost'
          aria-label='Update application'
          onClick={() => updateService(service)}
        >
          <CloudDownload aria-hidden='true' />
          <span
            className='ml-2 hidden sm:inline'
          >Update</span>
        </Button>
    }
  </article>
));





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Service;
