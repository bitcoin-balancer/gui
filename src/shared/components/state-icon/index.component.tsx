import { memo } from 'react';
import { MoveUpRight, TrendingUp, MoveRight, TrendingDown, MoveDownRight } from 'lucide-react';
import { IComponentProps } from '@/shared/components/state-icon/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * State Icon Component
 * Component in charge of displaying the icon corresponding to the current state.
 */
const StateIcon = memo(({ state, className }: IComponentProps) => {
  const classNames = `w-5 h-5${typeof className === 'string' ? ` ${className}` : ''}`;
  if (state === 2) {
    return (
      <MoveUpRight
        aria-hidden="true"
        className={`${classNames} text-increase-2`}
      />
    );
  }
  if (state === 1) {
    return (
      <TrendingUp
        aria-hidden="true"
        className={`${classNames} text-increase-1`}
      />
    );
  }
  if (state === -1) {
    return (
      <TrendingDown
        aria-hidden="true"
        className={`${classNames} text-decrease-1`}
      />
    );
  }
  if (state === -2) {
    return (
      <MoveDownRight
        aria-hidden="true"
        className={`${classNames} text-decrease-2`}
      />
    );
  }
  return (
    <MoveRight
      aria-hidden="true"
      className={`${classNames} text-stateless`}
    />
  );
});

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default StateIcon;
