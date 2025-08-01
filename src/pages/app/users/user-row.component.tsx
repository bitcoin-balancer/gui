import { useState, useMemo, useCallback } from 'react';
import {
  EllipsisVertical,
  UserPen,
  UserMinus,
  KeyRound,
  SquareAsterisk,
  Fingerprint,
  Loader2,
} from 'lucide-react';
import { delay } from 'web-utils-kit';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '@/shared/shadcn/components/ui/dropdown-menu.tsx';
import { TableCell, TableRow } from '@/shared/shadcn/components/ui/table.tsx';
import { copyToClipboard, errorToast } from '@/shared/services/utils/index.service.ts';
import { formatDate } from '@/shared/services/transformers/index.service.ts';
import { IBreakpoint } from '@/shared/services/media-query/index.service.ts';
import { UserService } from '@/shared/backend/auth/user/index.service.ts';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { useMediaQueryBreakpoint } from '@/shared/hooks/media-query-breakpoint/index.hook.ts';
import UpdateNickname from '@/pages/app/users/update-nickname.component.tsx';
import UpdateAuthority from '@/pages/app/users/update-authority.component.tsx';
import DisplayOTPSecret from '@/pages/app/users/display-otp-secret.component.tsx';
import DisplayAuthSessions from '@/pages/app/users/display-auth-sessions.component.tsx';
import DisplayPasswordUpdates from '@/pages/app/users/display-password-updates.component.tsx';
import { IUserRowProps, IAction, IDialogName } from '@/pages/app/users/types.ts';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Formats a date based on the current media query breakpoint.
 * @param date
 * @param breakpoint
 * @returns string
 */
const formatDateByBreakpoint = (date: number, breakpoint: IBreakpoint): string => {
  switch (breakpoint) {
    case 'xs':
    case 'sm':
    case 'md':
      return formatDate(date, 'date-short');
    case 'lg':
      return formatDate(date, 'date-medium');
    default:
      return formatDate(date, 'date-long');
  }
};

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * User Row Component
 * Component in charge of display the user's details and the actions menu.
 */
const UserRow = ({ user, dispatch }: IUserRowProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const [activeDialog, setActiveDialog] = useState<IDialogName | undefined>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const openConfirmationDialog = useBoundStore((state) => state.openConfirmationDialog);

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */
  const creation = useMemo(
    () => formatDateByBreakpoint(user.event_time, breakpoint),
    [user.event_time, breakpoint],
  );

  /* **********************************************************************************************
   *                                        EVENT HANDLERS                                        *
   ********************************************************************************************** */

  /**
   * Prompts the user with the confirmation dialog and deletes the selected user.
   */
  const deleteUser = () => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Delete user',
      description: `${user.nickname}’s account will be removed immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          await UserService.deleteUser(user.uid, confirmation);
          dispatch({ type: 'DELETE_USER', payload: user.uid });
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /**
   * Prompts the user with the confirmation dialog and updates the OTP secret for the selected user.
   */
  const updateOTPSecret = () => {
    openConfirmationDialog({
      mode: 'OTP',
      title: 'Update OTP secret',
      description: `${user.nickname}’s new OTP secret will become available immediately upon submission`,
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          const newSecret = await UserService.updateOTPSecret(user.uid, confirmation);
          dispatch({
            type: 'UPDATE_OTP_SECRET',
            payload: { uid: user.uid, newOTPSecret: newSecret },
          });

          // display the new secret
          await delay(0.25);
          setActiveDialog('DISPLAY_OTP_SECRET');
        } catch (e) {
          errorToast(e);
        } finally {
          setIsSubmitting(false);
        }
      },
    });
  };

  /**
   * Handles the dismissal of a form dialog that may contain an action. If so, it dispatches it.
   * @param action
   */
  const handleFormDismissal = useCallback(
    async (action: IAction | undefined) => {
      setActiveDialog(undefined);
      if (action) {
        dispatch(action);
      }
    },
    [dispatch],
  );

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* ***********
       * TABLE ROW *
       *********** */}
      <TableRow className={`${isSubmitting ? 'opacity-50' : ''} animate-in fade-in duration-700`}>
        {/* *****
         * UID *
         ***** */}
        <TableCell>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-36 2xl:max-w-40"
                onClick={() => copyToClipboard(user.uid)}
              >
                <p className="text-ellipsis overflow-hidden font-bold">{user.uid}</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to copy</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* **********
         * NICKNAME *
         ********** */}
        <TableCell>
          <p className="font-bold">{user.nickname}</p>
        </TableCell>

        {/* ***********
         * AUTHORITY *
         *********** */}
        <TableCell>
          <Badge variant="secondary">{user.authority}</Badge>
        </TableCell>

        {/* ************
         * OTP SECRET *
         ************ */}
        <TableCell>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setActiveDialog('DISPLAY_OTP_SECRET')}
                aria-label="Display OTP secret"
              >
                <KeyRound aria-hidden="true" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Display secret</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        {/* **********
         * CREATION *
         ********** */}
        <TableCell>
          <p>{creation}</p>
        </TableCell>

        {/* *********
         * ACTIONS *
         ********* */}
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                aria-label="User actions menu"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <Loader2 className="animate-spin" />
                ) : (
                  <EllipsisVertical aria-hidden="true" />
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.nickname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => setActiveDialog('UPDATE_NICKNAME')}
                disabled={user.authority === 5}
              >
                <UserPen
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Update nickname
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveDialog('UPDATE_AUTHORITY')}
                disabled={user.authority === 5}
              >
                <UserPen
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Update authority
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={updateOTPSecret}
                disabled={user.authority === 5}
              >
                <UserPen
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Update OTP secret
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={deleteUser}
                disabled={user.authority === 5}
              >
                <UserMinus
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Delete user
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveDialog('DISPLAY_AUTH_SESSIONS')}>
                <Fingerprint
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Display auth sessions
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => setActiveDialog('DISPLAY_PASSWORD_UPDATES')}
                disabled={user.authority === 5}
              >
                <SquareAsterisk
                  aria-hidden="true"
                  className="w-4 h-4 mr-1"
                />{' '}
                Display password updates
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>

      {/* **************
       * FORM DIALOGS *
       ************** */}
      {activeDialog === 'UPDATE_NICKNAME' && (
        <UpdateNickname
          uid={user.uid}
          nickname={user.nickname}
          closeDialog={handleFormDismissal}
        />
      )}
      {activeDialog === 'UPDATE_AUTHORITY' && (
        <UpdateAuthority
          uid={user.uid}
          nickname={user.nickname}
          authority={user.authority}
          closeDialog={handleFormDismissal}
        />
      )}

      {/* *****************
       * DISPLAY DIALOGS *
       ***************** */}
      {activeDialog === 'DISPLAY_OTP_SECRET' && (
        <DisplayOTPSecret
          uid={user.uid}
          nickname={user.nickname}
          closeDialog={handleFormDismissal}
        />
      )}
      {activeDialog === 'DISPLAY_AUTH_SESSIONS' && (
        <DisplayAuthSessions
          uid={user.uid}
          nickname={user.nickname}
          closeDialog={handleFormDismissal}
        />
      )}
      {activeDialog === 'DISPLAY_PASSWORD_UPDATES' && (
        <DisplayPasswordUpdates
          uid={user.uid}
          nickname={user.nickname}
          closeDialog={handleFormDismissal}
        />
      )}
    </>
  );
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default UserRow;
