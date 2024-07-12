import { IEnvironment } from './types';

/* ************************************************************************************************
 *                                      ENVIRONMENT VARIABLES                                     *
 ************************************************************************************************ */
const ENVIRONMENT: IEnvironment = {
  production: false,
  version: '(package.json).version',
  apiURL: '', // no staging environment in Balancer
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  ENVIRONMENT,
};
