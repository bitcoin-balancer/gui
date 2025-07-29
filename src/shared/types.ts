/* ************************************************************************************************
 *                                         UTILITY TYPES                                          *
 ************************************************************************************************ */

/**
 * Environment Name
 * The name of the kinds of environments that can be used when running Node.js processes.
 */
type INodeEnv = 'development' | 'production';

// the possible instances of HTML elements
type IHTMLElement = HTMLDivElement | HTMLTableSectionElement;

/**
 * Range
 * Utility type used for numeric ranges.
 */
type IRange = {
  min: number;
  max: number;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { INodeEnv, IHTMLElement, IRange };
