import {
  useState,
  useMemo,
  memo,
  useCallback,
} from 'react';
import {
  EllipsisVertical,
  UserPen,
  UserMinus,
  RectangleEllipsis,
  KeyRound,
  SquareAsterisk,
  Loader2,
} from 'lucide-react';
import { Button } from '../../../shared/shadcn/components/ui/button.tsx';
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '../../../shared/shadcn/components/ui/tooltip.tsx';
import { Badge } from '../../../shared/shadcn/components/ui/badge.tsx';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from '../../../shared/shadcn/components/ui/dropdown-menu.tsx';
import { TableCell, TableRow } from '../../../shared/shadcn/components/ui/table.tsx';
import { toast } from '../../../shared/shadcn/components/ui/use-toast.ts';
import { errorToast } from '../../../shared/services/utils/index.service.ts';
import { formatDate } from '../../../shared/services/transformations/index.service.ts';
import { IBreakpoint } from '../../../shared/services/media-query/index.service.ts';
import { ClipboardService } from '../../../shared/services/clipboard/index.service.ts';
import { UserService } from '../../../shared/backend/auth/user/index.service.ts';
import { useMediaQueryBreakpoint } from '../../../shared/hooks/media-query-breakpoint/index.hook.ts';
import { useBoundStore } from '../../../shared/store/index.store.ts';
import UpdateNickname from './update-nickname.component.tsx';
import UpdateAuthority from './update-authority.component.tsx';
import DisplayOTPSecret from './display-otp-secret.component.tsx';
import { IUserRowProps, IAction, IDialogName } from './types.ts';

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
      return formatDate(date, 'date-short');
    case 'md':
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
const UserRow = memo(({ user, dispatch }: IUserRowProps) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const breakpoint = useMediaQueryBreakpoint();
  const [activeDialog, setActiveDialog] = useState<IDialogName | false>(false);
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
      description: 'Once deleted, the user will be unable to interact with the API, and all their sessions will be destroyed.',
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
      description: 'Once updated, the old OTP secret will be immediately invalidated and the user will need to make use of the new one.',
      onConfirmation: async (confirmation: string) => {
        try {
          setIsSubmitting(true);
          const newSecret = await UserService.updateOTPSecret(user.uid, confirmation);
          dispatch({ type: 'UPDATE_OTP_SECRET', payload: { uid: user.uid, newOTPSecret: newSecret } });
          toast({ title: 'OTP secret updated', description: `The OTP secret for ${user.nickname} has been updated successfully.` });
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
    (action: IAction | false) => {
      if (action) {
        dispatch(action);
      }
      setActiveDialog(false);
    },
    [dispatch],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <>
      {/* TABLE ROW */}
      <TableRow className={`${isSubmitting ? 'opacity-50' : ''} animate-in fade-in duration-700`}>
        <TableCell>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant='ghost' size='sm' className='max-w-20 md:max-w-24 lg:max-w-32 xl:max-w-36 2xl:max-w-40' onClick={() => ClipboardService.writeText(user.uid)}>
                <p className='text-ellipsis overflow-hidden font-bold'>{user.uid}</p>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Click to copy</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>
        <TableCell>
          <p className='font-bold'>{user.nickname}</p>
        </TableCell>
        <TableCell>
          <Badge variant='secondary'>{user.authority}</Badge>
        </TableCell>
        <TableCell>
          <p>{creation}</p>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='ghost' size='icon' aria-label='User actions menu' disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="animate-spin" /> : <EllipsisVertical aria-hidden='true'/>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>{user.nickname}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveDialog('UPDATE_NICKNAME')} disabled={user.authority === 5}><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update nickname</DropdownMenuItem>
              <DropdownMenuItem onClick={() => setActiveDialog('UPDATE_AUTHORITY')} disabled={user.authority === 5}><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update authority</DropdownMenuItem>
              <DropdownMenuItem onClick={updateOTPSecret} disabled={user.authority === 5}><UserPen aria-hidden='true' className='w-5 h-5 mr-1' /> Update OTP secret</DropdownMenuItem>
              <DropdownMenuItem onClick={deleteUser} disabled={user.authority === 5}><UserMinus aria-hidden='true' className='w-5 h-5 mr-1' /> Delete user</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setActiveDialog('DISPLAY_OTP_SECRET')}><RectangleEllipsis aria-hidden='true' className='w-5 h-5 mr-1' /> Display OTP secret</DropdownMenuItem>
              <DropdownMenuItem><KeyRound aria-hidden='true' className='w-5 h-5 mr-1' /> Display auth sessions</DropdownMenuItem>
              <DropdownMenuItem><SquareAsterisk aria-hidden='true' className='w-5 h-5 mr-1' /> Display password updates</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>





      {/* FORM DIALOGS */}
      <UpdateNickname open={activeDialog === 'UPDATE_NICKNAME'} onOpenChange={handleFormDismissal} uid={user.uid} nickname={user.nickname} />
      <UpdateAuthority open={activeDialog === 'UPDATE_AUTHORITY'} onOpenChange={handleFormDismissal} uid={user.uid} nickname={user.nickname} authority={user.authority} />



      {/* DISPLAY DIALOGS */}
      <DisplayOTPSecret open={activeDialog === 'DISPLAY_OTP_SECRET'} onOpenChange={handleFormDismissal} uid={user.uid} />
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default UserRow;
