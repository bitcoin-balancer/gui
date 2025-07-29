import { memo, useMemo, useState } from 'react';
import { Bell, BellRing } from 'lucide-react';
import { prettifyBadgeCount } from 'web-utils-kit';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import NotificationsDialog from '@/pages/app/notifications-dialog.component.tsx';

/* ************************************************************************************************
 *                                            HELPERS                                             *
 ************************************************************************************************ */

/**
 * Builds the button's icon and badge based on the media breakpoint and the number of notifications.
 * @param unreadNotifications
 * @param size
 * @returns { icon: JSX.Element, badge: JSX.Element | null }
 */
const getComponentElements = (
  unreadNotifications: string | undefined,
  size: 'icon' | 'default',
): { icon: JSX.Element; badge: JSX.Element | null } => {
  // init values
  let icon: JSX.Element = (
    <Bell
      className="w-5 h-5"
      aria-hidden="true"
    />
  );
  let badgeClassName: string = '';

  // proceed if there are unread notifications
  if (unreadNotifications) {
    // set the icon
    icon = <BellRing aria-hidden="true" />;

    // set the spacing based on the number of unread notifications and the size of the btn
    if (unreadNotifications === '9+') {
      badgeClassName = size === 'icon' ? '-right-5' : '-right-3';
    } else {
      badgeClassName = size === 'icon' ? '-right-4' : '-right-2';
    }
  }

  // finally, return the elements
  return {
    icon,
    badge:
      unreadNotifications !== undefined ? (
        <div className={`absolute -top-2 ${badgeClassName}`}>
          <Badge className="py-0.5 px-1.5">{unreadNotifications}</Badge>
        </div>
      ) : null,
  };
};

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Notifications Button Component
 * Component in charge of showing the number of unread notifications as well as displaying the
 * dialog.
 */
const NotificationsButton = memo(({ size }: { size: 'icon' | 'default' }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const [open, setOpen] = useState<boolean>();
  const unreadNotifications = useBoundStore((state) => state.unreadNotifications!);

  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the number of notifications that have not been seen
  const unreadNotificationsString = useMemo(
    () => prettifyBadgeCount(unreadNotifications),
    [unreadNotifications],
  );

  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  const { icon, badge } = getComponentElements(unreadNotificationsString, size);
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            className={`relative ${size === 'icon' && unreadNotifications > 0 ? 'mr-2' : ''}`}
            aria-label="Display notification"
            size={size}
            onClick={() => setOpen(true)}
          >
            {icon}
            {badge}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>

      {/* **********************
       * NOTIFICATIONS DIALOG *
       ********************** */}
      {open && (
        <NotificationsDialog
          unreadCount={unreadNotifications}
          closeDialog={setOpen}
        />
      )}
    </>
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotificationsButton;
