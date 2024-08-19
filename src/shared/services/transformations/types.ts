

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Date Format
 * The list of formats supported for dates and times. Supported values are:
 * - date-short: 29/04/1453 (dd/LL/yyyy)
 * - date-medium: April 29th, 1453 (PPP)
 * - date-long: Friday, April 29th, 1453 (PPPP)
 * - time-short: 12:00 AM
 * - time-medium: 12:00:00 AM
 * - datetime-short: 29/04/1453, 12:00 AM (dd/LL/yyyy, pp)
 * - datetime-medium: Apr 29, 1453, 12:00:00 AM (PPpp)
 * - datetime-long: Friday, April 29th, 1453 at ... (PPPPpp)
 */
type IDateFormat = 'date-short' | 'date-medium' | 'date-long'
| 'time-short' | 'time-medium'
| 'datetime-short' | 'datetime-medium' | 'datetime-long';



/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  IDateFormat,
};
