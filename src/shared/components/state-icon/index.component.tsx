import {
  MoveUpRight,
  TrendingUp,
  MoveRight,
  TrendingDown,
  MoveDownRight,
} from 'lucide-react';
import { ColorService } from '@/shared/services/color/index.service.ts';
import { IComponentProps } from '@/shared/components/state-icon/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * State Icon Component
 * Component in charge of displaying the icon corresponding to the current state.
 */
const StateIcon = ({ state, className }: IComponentProps) => {
  const classNames = `w-4 h-4${typeof className === 'string' ? ` ${className}` : ''}`;
  if (state === 2) {
    return <MoveUpRight aria-hidden='true' className={`${classNames} ${ColorService.INCREASE_2}`} />;
  }
  if (state === 1) {
    return <TrendingUp aria-hidden='true' className={`${classNames} ${ColorService.INCREASE_1}`} />;
  }
  if (state === -1) {
    return <TrendingDown aria-hidden='true' className={`${classNames} ${ColorService.DECREASE_1}`} />;
  }
  if (state === -2) {
    return <MoveDownRight aria-hidden='true' className={`${classNames} ${ColorService.DECREASE_2}`} />;
  }
  return <MoveRight aria-hidden='true' className={`${classNames} ${ColorService.STATELESS}`} />;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default StateIcon;
