import { APIService } from '../api/index.service.ts';
import { IIPBlacklistService, IIPBlacklistRecord } from './types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * IP Blacklist Service Factory
 * Generates the object in charge of keeping track of potentially malicious IP Addresses.
 * @returns IIPBlacklistService
 */
const ipBlacklistServiceFactory = (): IIPBlacklistService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves a list of IP Blacklist Records from the database. A custom starting point can be
   * provided in order to paginate through the records.
   * @param limit
   * @param startAtID?
   * @returns Promise<IIPBlacklistRecord[]>
   * @throws
   * - 5255: if the starting point is provided and is invalid
   * - 5256: if the query limit is larger than the limit
   */
  const list = (
    limit: number,
    startAtID?: number,
  ): Promise<IIPBlacklistRecord[]> => {
    let urlPath: string = `ip-blacklist?limit=${limit}`;
    if (typeof startAtID === 'number') {
      urlPath += `&startAtID=${startAtID}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    ) as Promise<IIPBlacklistRecord[]>;
  };





  /* **********************************************************************************************
   *                                       RECORD MANAGEMENT                                      *
   ********************************************************************************************** */

  /**
   * Registers an IP Address in the Blacklist. Once registered, the API won't serve future requests
   * sent by the IP.
   * @param ip
   * @param notes
   * @param otpToken
   * @returns Promise<IIPBlacklistRecord>
   * @throws
   * - 5250: if the IP has an invalid format
   * - 5251: if the notes have been provided but are invalid
   * - 5252: if the IP Address has already been registered
   */
  const registerIP = (
    ip: string,
    notes: string | undefined,
    otpToken: string,
  ) => APIService.request(
    'POST',
    'ip-blacklist',
    { ip, notes },
    true,
    otpToken,
  ) as Promise<IIPBlacklistRecord>;


  /**
   * Updates an IP Blacklist Registration Record.
   * @param id
   * @param ip
   * @param notes
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 5250: if the IP has an invalid format
   * - 5251: if the notes have been provided but are invalid
   * - 5252: if the identifier has an invalid format
   * - 5253: if the IP has already been blacklisted by a different record
   */
  const updateIPRegistration = async (
    id: number,
    ip: string,
    notes: string | undefined,
    otpToken: string,
  ): Promise<void> => APIService.request(
    'PUT',
    `ip-blacklist/${id}`,
    { ip, notes },
    true,
    otpToken,
  ) as Promise<void>;

  /**
   * Unregisters an IP Address from the Blacklist.
   * @param id
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 5254: if the registration cannot be found in the database
   */
  const unregisterIP = async (id: number, otpToken: string): Promise<void> => APIService.request(
    'DELETE',
    `ip-blacklist/${id}`,
    {},
    true,
    otpToken,
  ) as Promise<void>;





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    list,

    // record management
    registerIP,
    updateIPRegistration,
    unregisterIP,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const IPBlacklistService = ipBlacklistServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  IPBlacklistService,

  // types
  type IIPBlacklistRecord,
};
