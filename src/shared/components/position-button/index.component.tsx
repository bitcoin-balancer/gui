import { formatDistance } from 'date-fns';
import { memo, useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { ExternalLink, ReceiptText } from 'lucide-react';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/shared/shadcn/components/ui/sheet.tsx';
import { formatDate, formatPNL } from '@/shared/services/transformers/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { ICompactPosition } from '@/shared/backend/position/index.service.ts';
import { NavService } from '@/shared/services/nav/index.service.ts';
import { useLazyDialog } from '@/shared/hooks/lazy-dialog/index.hook.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Button Component
 * Component in charge of displaying general info about a position as well as handling its actions.
 */
const PositionButton = memo(({ record }: { record: ICompactPosition }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [isMenuVisible, setIsMenuVisible] = useState<boolean>();
  const actionsMenu = useLazyDialog(setIsMenuVisible, 0.75);
  const openPositionDialog = useBoundStore((state) => state.openPositionDialog);
  const navigate = useNavigate();

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // open times
  const openTime = useMemo(() => formatDate(record.open, 'datetime-medium'), [record.open]);

  // time distance
  const timeDistance = useMemo(
    () => (record.close === null ? 'Running...' : formatDistance(record.open, record.close)),
    [record.open, record.close],
  );

  // pnl
  const pnl = useMemo(() => formatPNL(record.pnl), [record.pnl]);

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Displays the menu containing the actions that can be taken.
   */
  const displayActionsMenu = () => {
    setIsMenuVisible(true);
    actionsMenu.setIsDialogOpen(true);
  };

  /**
   * Closes the actions menu and navigates to the position's route.
   */
  const handleNavigateToPosition = async () => {
    await actionsMenu.handleCloseDialog();
    navigate(NavService.position(record.id));
  };

  /**
   * Closes the actions menu and opens the position's dialog.
   */
  const handleOpenPositionDialog = async () => {
    await actionsMenu.handleCloseDialog();
    openPositionDialog(record.id);
  };

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ********
       * BUTTON *
       ******** */}
      <button
        id={`pb-${record.id}`}
        className={`p-6 flex justify-start items-center w-full text-left ${record.archived ? 'opacity-50' : ''} hover:bg-slate-100`}
        onClick={displayActionsMenu}
        aria-label="Display position"
      >
        <div className="max-w-[60%] sm:max-w-[70%]">
          <p className="font-medium truncate">{openTime}</p>
          <p className="text-light text-sm truncate">{timeDistance}</p>
        </div>

        <span className="flex-1"></span>

        <Badge
          className={`bg-stateless hover:bg-stateless/85 ${record.pnl > 0 ? 'bg-increase-1 hover:bg-increase-1/85' : 'bg-decrease-1 hover:bg-decrease-1/85'}`}
        >
          {pnl}
        </Badge>
      </button>

      {/* **************
       * ACTIONS MENU *
       ************** */}
      {isMenuVisible && (
        <Sheet
          open={actionsMenu.isDialogOpen}
          onOpenChange={actionsMenu.handleCloseDialog}
        >
          <SheetContent side="bottom">
            <div className="mx-auto w-full max-w-sm">
              <SheetHeader className="space-y-0">
                <SheetTitle>Position</SheetTitle>
                <SheetDescription className="text-xs">{record.id}</SheetDescription>
              </SheetHeader>

              <div className="flex flex-row justify-center items-stretch gap-2 sm:gap-4 mt-5">
                <Button
                  variant="outline"
                  aria-label="Go to the position page"
                  className="w-full flex-1 flex flex-col h-20 gap-y-1"
                  onClick={handleNavigateToPosition}
                >
                  <ExternalLink aria-hidden="true" />
                  <p>Navigate</p>
                </Button>
                <Button
                  variant="outline"
                  aria-label="Open the position‘s dialog"
                  className="w-full flex-1 flex flex-col h-20 gap-y-1"
                  onClick={handleOpenPositionDialog}
                >
                  <ReceiptText aria-hidden="true" />
                  <p>Details</p>
                </Button>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default PositionButton;
