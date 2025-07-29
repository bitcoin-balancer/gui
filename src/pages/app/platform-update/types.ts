import { IAvailableUpdates, IServiceVersion } from '@/shared/backend/version/index.service.ts';

/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

// the services that comprise Balancer
type IServiceName = 'GUI' | 'API';

/**
 * Service Component Props
 * ...
 */
type IServiceComponentProps = {
  service: IServiceName;
  version: IServiceVersion;
  availableUpdates: IAvailableUpdates;
  updateService: (service: IServiceName) => void;
};

/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type { IServiceName, IServiceComponentProps };
