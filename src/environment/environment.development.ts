import { IEnvironment } from './types';

/* ************************************************************************************************
 *                                      ENVIRONMENT VARIABLES                                     *
 ************************************************************************************************ */
const ENVIRONMENT: IEnvironment = {
  production: false,
  version: '(package.json).version',
  apiURL: 'http://localhost:5075',
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ENVIRONMENT,
};
