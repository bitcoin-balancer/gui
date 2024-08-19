import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/shared/shadcn/components/ui/card.tsx';
import { useBoundStore } from '@/shared/store/index.store';
import PageLoader from '@/shared/components/page-loader/index.component.tsx';
import WindowState from '@/pages/app/dashboard/window/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Dashboard Component
 * Component in charge of displaying and managing the market state and trading strategy.
 */
const Dashboard = () => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const marketState = useBoundStore((state) => state.marketState!);





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  if (marketState === undefined) {
    return <PageLoader />;
  }
  return (
    <div
      className='page-container flex flex-col sm:flex-row justify-center items-start gap-5 animate-in fade-in duration-700'
    >

      <section
        className='w-full lg:w-8/12 xl:w-8/12 2xl:w-9/12'
      >
        {/* **************
          * WINDOW STATE *
          ************** */}
        <WindowState
          windowState={marketState.windowState}
        />
      </section>

      <aside
        className='flex-1'
      >
        <Card>
          <CardHeader>
            <CardTitle>Position</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Card Content</p>
          </CardContent>
        </Card>
      </aside>

    </div>
  );
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default Dashboard;
