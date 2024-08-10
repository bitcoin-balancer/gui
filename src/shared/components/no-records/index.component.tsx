import { IComponentProps } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * NoRecords Component
 * Component in charge of displaying a message when no records are found in the database.
 */
const NoRecords = ({ message = 'No records were found', className }: IComponentProps) => (
  <p
    className={`text-light text-sm text-center my-5 animate-in fade-in duration-700 ${typeof className === 'string' ? className : ''}`}
  >{message}</p>
);





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export default NoRecords;
