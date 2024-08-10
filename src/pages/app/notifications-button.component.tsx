import { memo, useMemo } from 'react';
import {
  Bell,
  BellRing,
} from 'lucide-react';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { Tooltip, TooltipTrigger, TooltipContent } from '@/shared/shadcn/components/ui/tooltip.tsx';
import { useBoundStore } from '@/shared/store/index.store.ts';
import { formatBadgeCount } from '@/shared/services/transformations/index.service';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Notifications Button Component
 * Component in charge of ...
 */
const NotificationsButton = memo(({ size }: { size: 'icon' | 'default' }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const unreadNotifications = useBoundStore((state) => state.unreadNotifications!);





  /* **********************************************************************************************
   *                                       REACTIVE VALUES                                        *
   ********************************************************************************************** */

  // the number of notifications that have not been seen
  const unreadNotificationsString = useMemo(
    () => formatBadgeCount(unreadNotifications),
    [unreadNotifications],
  );





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  const icon = unreadNotifications > 0 ? <BellRing aria-hidden='true' /> : <Bell aria-hidden='true' />;
  const badge = unreadNotifications > 0
    ? <div
      className={`absolute ${size === 'icon' ? '-top-2 -right-4' : '-top-2 -right-2'}`}
    >
      <Badge
        className='py-0.5 px-1.5'
      >{unreadNotificationsString}</Badge>
    </div>
    : null;
  return (
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='ghost'
            className={`relative ${size === 'icon' && unreadNotifications > 0 ? 'mr-2' : ''}`}
            aria-label='Display notification'
            size={size}
          >
            {icon}
            {badge}
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Notifications</p>
        </TooltipContent>
      </Tooltip>
    </>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NotificationsButton;
