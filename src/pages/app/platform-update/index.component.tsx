import { formatRelative } from 'date-fns';
import { useState, useMemo } from 'react';
import { CodeXml } from 'lucide-react';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { VersionService } from '@/shared/backend/version/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { NavService } from '@/shared/services/nav/index.service';

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
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <div
        className='page-container flex justify-center items-start animate-in fade-in duration-700'
      >

        <section
          className='w-full lg:w-9/12 xl:w-7/12 2xl:w-6/12'
        >

          <h1 className="text-2xl md:text-3xl">Platform Update</h1>


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

                  <div>
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
                      <p>
                        v{version.gui.latest.version}&nbsp;·&nbsp;
                        {version.gui.latest.sha.slice(0, 7)}&nbsp;·&nbsp;
                        {formatRelative(version.gui.latest.eventTime, new Date())}
                      </p>
                    </a>
                  </div>

                  <span className='flex-1'></span>


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
