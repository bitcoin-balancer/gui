import { useMemo, useState } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { formatDate } from '@/shared/services/transformations/index.service.ts';
import StateIcon from '@/shared/components/state-icon/index.component.tsx';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { IComponentProps } from '@/pages/app/dashboard/window/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window State Component
 * Component in charge of displaying the current state of the window.
 */
const WindowState = ({ windowState }: IComponentProps) => {
  /* **********************************************************************************************
   *                                             REFS                                             *
   ********************************************************************************************** */



  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [active, setActive] = useState();




  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the opening time of the current bar
  const currentBar = useMemo(
    () => formatDate(windowState.window.id[windowState.window.id.length - 1], 'datetime-medium'),
    [windowState.window.id],
  );





  /* **********************************************************************************************
   *                                         SIDE EFFECTS                                         *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <Card>
      <CardHeader className='flex flex-col sm:flex-row justify-start items-start'>
        <div>
          <CardTitle className='flex justify-start items-center gap-2'>
            Window
            <StateIcon state={windowState.state} />
          </CardTitle>
          <CardDescription>{currentBar}</CardDescription>
        </div>
        <span className='flex-1'></span>
        <div className='grid grid-cols-4 gap-2'>

        </div>
      </CardHeader>
      <CardContent>
        <CandlestickChart
          height={600}
          data={windowState.window}
          state={windowState.state}
        />
      </CardContent>
    </Card>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowState;
