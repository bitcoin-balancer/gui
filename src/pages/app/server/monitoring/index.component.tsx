/* import { useMemo } from 'react'; */
import { Label, Pie, PieChart } from 'recharts';
import { CodeXml, ExternalLink, Github } from 'lucide-react';
import { Button } from '../../../../shared/shadcn/components/ui/button.tsx';
import { Badge } from '../../../../shared/shadcn/components/ui/badge.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../../shared/shadcn/components/ui/tooltip.tsx';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from '../../../../shared/shadcn/components/ui/chart.tsx';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../../../shared/shadcn/components/ui/card.tsx';
import { ENVIRONMENT } from '../../../../environment/environment.ts';
import { formatDate } from '../../../../shared/services/transformations/index.service.ts';
import { NavService } from '../../../../shared/services/nav/index.service.ts';
import { buildAPIURL } from '../../../../shared/backend/api/index.service.ts';
import { ServerService, IServerState } from '../../../../shared/backend/server/index.service.ts';
import { useAPIRequest } from '../../../../shared/hooks/api-request/index.hook.ts';
import PageLoader from '../../../../shared/components/page-loader/index.component.tsx';
import PageLoadError from '../../../../shared/components/page-load-error/index.component.tsx';

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


  const chartData = [
    { memory: 'active', value: 275, fill: '#0C0C0C' },
    { memory: 'free', value: 200, fill: '#f1f5f9' },
  ];






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
      <section className='w-full'>

        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10'>

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
                {/* ENVIRONMENT.apiURL */}<p className='max-w-36 lg:max-w-44 xl:max-w-none truncate'>https://balancerapi.jesusgraterol.dev</p> <ExternalLink aria-hidden='true' className='w-4 h-4 ml-1' />
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

          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Memory</CardTitle>
            </CardHeader>

            <ChartContainer className='mx-auto aspect-square max-h-[180px]'
                            config={{
                              value: {
                                label: 'Bytes',
                              },
                              active: {
                                label: 'Active',
                                color: '#0C0C0C',
                              },
                              free: {
                                label: 'Free',
                                color: '#f1f5f9',
                              },
                            }}>
                <PieChart>
                  <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                  />
                  <Pie
                    data={[
                      { memory: 'active', value: data.memory.active, fill: '#0C0C0C' },
                      { memory: 'free', value: data.memory.free, fill: '#f1f5f9' },
                    ]}
                    dataKey='value'
                    nameKey='memory'
                    innerRadius={60}
                    strokeWidth={5}
                  >
                    <Label
                      content={({ viewBox }) => {
                        if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                          return (
                            <text
                              x={viewBox.cx}
                              y={viewBox.cy}
                              textAnchor='middle'
                              dominantBaseline='middle'
                            >
                              <tspan
                                x={viewBox.cx}
                                y={viewBox.cy}
                                className='fill-foreground text-3xl font-bold'
                              >
                                {data.memory.usage}
                              </tspan>
                              <tspan
                                x={viewBox.cx}
                                y={(viewBox.cy || 0) + 24}
                                className='fill-muted-foreground'
                              >
                                Usage%
                              </tspan>
                            </text>
                          );
                        }
                        return undefined;
                      }}
                    />
                  </Pie>
                </PieChart>
            </ChartContainer>


          </Card>

        </div>

        <div className='flex flex-col md:flex-row justify-center items-start gap-5 lg:gap-10 mt-5 lg:mt-10'>
          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>

          <Card className='w-full'>
            <CardHeader>
              <CardTitle>Card Title</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
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
