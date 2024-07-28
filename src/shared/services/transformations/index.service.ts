

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Formats the number that will be inserted in a badge so it doesn't take too much space.
 * @param count
 * @param maxValue?
 * @returns string | undefined
 */
const formatBadgeCount = (count: number, maxValue: number = 9): string | undefined => {
  if (count === 0) {
    return undefined;
  }
  if (count >= maxValue) {
    return `${maxValue}+`;
  }
  return String(count);
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  formatBadgeCount,
};
