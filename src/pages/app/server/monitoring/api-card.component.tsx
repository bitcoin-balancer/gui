import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { CodeXml, ExternalLink, Github } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { buildAPIURL } from '@/shared/backend/api/utils.ts';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { IServerState } from '@/shared/backend/server/index.service.ts';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';


/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// API's ping url
const API_URL = buildAPIURL('ping');




/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * API Card Component
 * Component in charge of displaying general information regarding the API.
 */
const APICard = ({ data }: { data: IServerState }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const version = useBoundStore((state) => state.version!);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // available service updates
  const availableUpdates = useMemo(() => VersionService.getAvailableUpdates(version), [version]);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card
      className='w-full py-2'
    >
      <div
        className='flex justify-start items-start p-6'
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
            >API</Badge>
          </div>
          <div
            className='text-left'>
              {
                availableUpdates === null
                  ? <a
                      href={NavService.buildAPICommitURL(version.api.latest.sha)}
                      target='_blank'
                      rel='noopener noreferrer'
                      className='flex justify-start items-center mt-2 text-sm text-light p-0'
                      style={{ marginTop: 3 }}
                    >
                      <CodeXml
                          className='mr-1 w-4 h-4'
                      />
                      <p
                        className='truncate text-sm'
                      >
                        v{version.api.latest.version}&nbsp;·&nbsp;
                        {version.api.latest.sha.slice(0, 7)}&nbsp;·&nbsp;
                        {formatDate(version.api.latest.eventTime, 'date-short')}
                      </p>
                    </a>
                  : <Link
                    className='flex justify-start items-center text-light text-sm mt-1'
                    to={NavService.platformUpdate()}
                  >
                    <CodeXml
                      className='mr-1 w-4 h-4'
                    />
                    <p>Update available</p>
                  </Link>
              }

          </div>
        </div>
        <span className='flex-1'></span>
        <Button
          variant='ghost'
          size='icon'
          aria-label='Open the API’s repository in a new tab'
          onClick={() => NavService.openAPIRepo()}
        ><Github aria-hidden='true' /></Button>
      </div>

      <CardContent>
        <div
          className='flex justify-start items-center'
        >
          <p
            className='text-light text-sm'
          >Uptime</p>
          <span className='flex-1'></span>
          <p>{Math.ceil((data.uptime / 60) / 60)} hours</p>
        </div>
        <div
          className='flex justify-start items-center mt-4'
        >
          <p
            className='text-light text-sm'
          >URL</p>
          <span className='flex-1'></span>
          <a
            href={API_URL}
            target='_black'
            rel='noopener noreferrer'
            className='flex justify-start items-center'
            aria-label='Open the API on a new tab'
          >
            <p
              className='max-w-36 lg:max-w-44 xl:max-w-none truncate'
            >{buildAPIURL('')}</p>
            <ExternalLink
              aria-hidden='true'
              className='w-4 h-4 ml-1'
            />
          </a>
        </div>
        <div
          className='flex justify-start items-center mt-4'
        >
          <p
            className='text-light text-sm'
          >Environment</p>
          <span className='flex-1'></span>
          <p>{data.environment}</p>
        </div>
        <div
          className='flex justify-start items-center mt-4 text-ellipsis overflow-hidden'
        >
          <p
            className='text-light text-sm'
          >Last scan</p>
          <span className='flex-1'></span>
          <p
            className='max-w-32 lg:max-w-44 xl:max-w-none truncate'
          >{formatDate(data.refetchTime, 'datetime-short')}</p>
        </div>
      </CardContent>
    </Card>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default APICard;
