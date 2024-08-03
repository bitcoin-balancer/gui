

/* ************************************************************************************************
 *                                         UTILITY TYPES                                          *
 ************************************************************************************************ */

/**
 * Environment Name
 * The name of the kinds of environments that can be used when running Node.js processes.
 */
type INodeEnv = 'development' | 'production';

/**
 * Record
 * This utility type is used to replace the original 'object' type which can become difficult to
 * deal with.
 */
type IRecord<T> = {
  [key: string]: T;
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  INodeEnv,
  IRecord,
};
