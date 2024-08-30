import { useState, Fragment } from 'react';
import {
  ChartCandlestick,
  Droplet,
  Bitcoin,
  Undo2,
  ArrowLeftRight,
  Server,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Separator } from '@/shared/shadcn/components/ui/separator.tsx';
import { Card, CardContent } from '@/shared/shadcn/components/ui/card.tsx';
import Window from '@/pages/app/adjustments/window.component.tsx';
import Coins from '@/pages/app/adjustments/coins.component.tsx';
import ServerAlarms from '@/pages/app/adjustments/server-alarms.component.tsx';
import { IFormID, IFormItem } from '@/pages/app/adjustments/types.ts';

/* ************************************************************************************************
 *                                           CONSTANTS                                            *
 ************************************************************************************************ */

// the list of forms that comprise the adjustments module
const FORMS: IFormItem[] = [
  {
    id: 'WINDOW',
    title: 'Window',
    description: 'Configure the requirements for the window splits to be stateful',
    icon: <ChartCandlestick aria-hidden='true' />,
  },
  {
    id: 'LIQUIDITY',
    title: 'Liquidity',
    description: 'Configure how the order book is processed and the state is calculated',
    icon: <Droplet aria-hidden='true' />,
  },
  {
    id: 'COINS',
    title: 'Coins',
    description: 'Configure the requirements for coins to be stateful as well as the whitelist',
    icon: <Bitcoin aria-hidden='true' />,
  },
  {
    id: 'REVERSAL',
    title: 'Reversal',
    description: 'Configure the requirements for reversal events to be issued',
    icon: <Undo2 aria-hidden='true' className='rotate-90' />,
  },
  {
    id: 'STRATEGY',
    title: 'Strategy',
    description: 'Configure the way positions are increased and reduced',
    icon: <ArrowLeftRight aria-hidden='true' />,
  },
  {
    id: 'SERVER_ALARMS',
    title: 'Server alarms',
    description: 'Configure the levels at which alarms should be issued',
    icon: <Server aria-hidden='true' />,
  },
];





/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Adjustments Component
 * Component in charge of adjusting Balancer's tunable modules.
 */
const Adjustments = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [activeDialog, setActiveDialog] = useState<IFormID>();



  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      <div
        className='page-container flex justify-center items-start animate-in fade-in duration-700'
      >

        <section
          className='w-full md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12'
        >

          <header
            className='flex justify-start items-center'
          >
            <h1
              className='text-2xl font-semibold leading-none tracking-tight'
            >Adjustments</h1>
            <span className="flex-1"></span>
          </header>

          <article
            className='mt-5'
          >
            <Card>
              <CardContent
                className='pt-0 md:p-0'
              >
                {FORMS.map((form, i) => (
                  <Fragment key={form.id}>
                    <Button
                      variant='ghost'
                      className='flex justify-start items-center w-full h-20 text-left'
                      onClick={() => setActiveDialog(form.id)}
                    >
                      {form.icon}
                      <div
                        className='ml-2 max-w-52 sm:max-w-none'
                      >
                        <p
                          className='font-bold'
                        >{form.title}</p>
                        <p
                          className='text-light text-xs truncate'
                        >{form.description}</p>
                      </div>
                    </Button>
                    {(i < FORMS.length - 1) && <Separator />}
                  </Fragment>
                ))}
              </CardContent>
            </Card>
          </article>

        </section>

      </div>



      {/* ***************
        * FORM DIALOGS *
        *************** */}
      {
        activeDialog === 'WINDOW'
        && <Window
          closeDialog={setActiveDialog}
        />
      }
      {
        activeDialog === 'COINS'
        && <Coins
        closeDialog={setActiveDialog}
        />
      }
      {
        activeDialog === 'SERVER_ALARMS'
        && <ServerAlarms
          closeDialog={setActiveDialog}
        />
      }
    </>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Adjustments;
