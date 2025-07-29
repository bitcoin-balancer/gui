import { IWindowState } from '@/shared/backend/market-state/window/index.service.ts';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { toSplitStateItems } from '@/shared/backend/market-state/shared/utils.ts';
import { ISplitStatesDialogData } from '@/pages/app/dashboard/split-states-dialog/index.component.tsx';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Window Button Component
 * Component in charge of rendering the window's indicator button as well as handling its actions.
 */
const WindowButton = ({
  windowState,
  openSplitStatesDialog,
}: {
  windowState: IWindowState;
  openSplitStatesDialog: (data: ISplitStatesDialogData) => void;
}) => {
  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Opens the window state dialog an activates the split ID.
   */
  const openWindowStateDialog = (): void =>
    openSplitStatesDialog({
      moduleID: 'WINDOW',
      moduleState: {
        state: windowState.state,
        splitStates: windowState.splitStates,
        window: toSplitStateItems(windowState.window),
      },
    });

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <button
      className={`h-[45px] text-xs text-white font-bold ${ColorService.STATE_BG_CLASS_NAME[windowState.state]} hover:opacity-80`}
      onClick={openWindowStateDialog}
    >
      WINDOW
    </button>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default WindowButton;
