import { memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/shared/shadcn/components/ui/button.tsx';
import { Badge } from '@/shared/shadcn/components/ui/badge.tsx';
import { IMainNavigationItem } from '@/pages/app/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Mobile Tabs
 * Component in charge of providing navigation capabilities for mobile.
 */
const MobileTabs = memo(({ items }: { items: IMainNavigationItem[] }) => {
  /* **********************************************************************************************
   *                                             STATE                                            *
   ********************************************************************************************** */
  const navigate = useNavigate();





  /* **********************************************************************************************
   *                                           COMPONENT                                          *
   ********************************************************************************************** */
  return (
    <nav
      className='fixed bottom-0 left-0 z-10 bg-white border-t border-t-slate-200 flex justify-center items-center w-full md:hidden'
    >
      {items.map((item, i) => (item.badge
        ? <Button
            key={i}
            variant='ghost'
            size='icon'
            className={`h-14 flex-1 rounded-none ${item.active ? 'text-slate-500' : ''}`}
            aria-label={item.name}
            onClick={() => navigate(item.path)}
            disabled={item.active}
        >
          <div className='relative'>
            {item.icon}
            <div
              className={`absolute -top-5 ${item.badge === '9+' ? '-right-6' : '-right-5'}`}
            >
              <Badge
                className='py-0.5 px-1.5'
              >{item.badge}</Badge>
            </div>
          </div>
        </Button>
        : <Button
          key={i}
          variant='ghost'
          size='icon'
          className={`h-14 flex-1 rounded-none ${item.active ? 'text-slate-500' : ''}`}
          aria-label={item.name}
          onClick={() => navigate(item.path)}
          disabled={item.active}
        >
          {item.icon}
        </Button>
      ))}
    </nav>
  );
});





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default MobileTabs;
