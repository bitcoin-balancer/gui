import { IEnvironment } from './types';

/* ************************************************************************************************
 *                                      ENVIRONMENT VARIABLES                                     *
 ************************************************************************************************ */
const ENVIRONMENT: IEnvironment = {
  production: false,
  version: '(package.json).version',
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export { ENVIRONMENT };
