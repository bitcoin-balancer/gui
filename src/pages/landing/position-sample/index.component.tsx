import { memo } from 'react';
import { ChevronDown } from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import CandlestickChart from '@/shared/components/charts/candlestick-chart/index.component.tsx';
import { MARKERS, DATA } from '@/pages/landing/position-sample/data.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Sample
 * Component in charge of displaying what a position looks like.
 */
const PositionSample = memo(
  ({
    breakpoint,
    openUnderConstructionDialog,
  }: {
    breakpoint: IBreakpoint;
    openUnderConstructionDialog: () => void;
  }) => (
    <div className="w-full flex justify-center items-start">
      <section className="w-full md:w-11/12 lg:w-9/12 xl:w-8/12 2xl:w-7/12">
        <div className="w-full flex flex-col md:flex-row justify-center items-center gap-4 relative">
          <aside className="w-full text-center md:text-left p-3 z-10">
            <h2 className="text-4xl sm:text-5xl font-bold">
              <strong className="text-increase-1">Buy</strong> the dip
            </h2>
            <h2 className="text-4xl sm:text-5xl font-bold mt-3">
              <strong className="text-decrease-1">Sell</strong> the rally
            </h2>
            <p className="mt-5 text-lg">
              Navigate Bitcoin's volatility with your own Balancer instance, enjoying top-notch
              security and complete privacy.
            </p>
            <p className="text-xs sm:text-sm mt-2 text-light">
              Trade automatically via your preferred exchange.
            </p>

            {breakpoint !== 'xs' && breakpoint !== 'sm' && (
              <div className="flex justify-start items-center gap-2 mt-5">
                <Button onClick={NavService.openGitHubPage}>Get Balancer</Button>

                <Button
                  variant="outline"
                  className="items-center gap-1"
                  onClick={openUnderConstructionDialog}
                >
                  Videos <ChevronDown className="w-4 h-4" />
                </Button>
              </div>
            )}
          </aside>

          <article className="w-full 2xl:w-10/12 px-5 sm:px-0 -mt-20">
            <CandlestickChart
              height={breakpoint === 'xs' || breakpoint === 'sm' ? 400 : 500}
              data={DATA}
              markers={MARKERS}
              showAttributionLogo={false}
              hideTimeScale={true}
              hideRightPriceScale={true}
              hideCrosshair={true}
              hidePriceLine={true}
              disableScrollHandler={true}
              disableScaleHandler={true}
            />
          </article>
        </div>

        {(breakpoint === 'xs' || breakpoint === 'sm') && (
          <div className="flex justify-center items-center gap-2 mt-5">
            <Button onClick={NavService.openGitHubPage}>Get Balancer</Button>

            <Button
              variant="outline"
              className="items-center gap-1"
              onClick={openUnderConstructionDialog}
            >
              Videos <ChevronDown className="w-4 h-4" />
            </Button>
          </div>
        )}
      </section>
    </div>
  ),
);

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionSample;
