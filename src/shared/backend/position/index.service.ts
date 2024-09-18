import { APIService } from '@/shared/backend/api/index.service.ts';
import { IEventHistoryRecord } from '../candlestick/index.service.js';
import { ICompactPosition, IPosition, IPositionService } from './types.js';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Position Service Factory
 * Generates the object in charge of opening, increasing and decreasing positions.
 * @returns IPositionService
 */
const positionServiceFactory = (): IPositionService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                           ACTIONS                                            *
   ********************************************************************************************** */

  /**
   * Opens or increases a position.
   * @param otpToken
   * @returns Promise<void>
   */
  const increasePosition = (otpToken: string): Promise<void> => (
    APIService.request(
      'POST',
      'position/increase',
      undefined,
      true,
      otpToken,
    ) as Promise<void>
  );

  /**
   * Validates and attempts to decrease an active position.
   * @param percentage
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 30507: if there isn't an active position
   * - 30508: if the percentage is not a valid number
   */
  const decreasePosition = (percentage: number, otpToken: string): Promise<void> => (
    APIService.request(
      'POST',
      'position/decrease',
      { percentage },
      true,
      otpToken,
    ) as Promise<void>
  );

  /**
   * Archives a position by its ID.
   * @param id
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 30500: if the ID is not a valid uuid v4
   * - 30509: if the positon doesn't exist
   * - 30510: if the positon has already been archived
   */
  const archivePosition = (id: string, otpToken: string): Promise<void> => (
    APIService.request(
      'PATCH',
      `position/archive/${id}`,
      undefined,
      true,
      otpToken,
    ) as Promise<void>
  );

  /**
   * Unarchives a position by its ID.
   * @param id
   * @param otpToken
   * @returns Promise<void>
   * @throws
   * - 30500: if the ID is not a valid uuid v4
   * - 30509: if the positon doesn't exist
   * - 30511: if the positon is not archived
   */
  const unarchivePosition = (id: string, otpToken: string): Promise<void> => (
    APIService.request(
      'PATCH',
      `position/unarchive/${id}`,
      undefined,
      true,
      otpToken,
    ) as Promise<void>
  );





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves a position record from the local property or from the database by ID.
   * @param id
   * @returns Promise<IPosition>
   * @throws
   * - 30500: if the ID is not a valid uuid v4
   * - 30000: if the position does not exist
   */
  const getPosition = (id: string): Promise<IPosition> => APIService.request(
    'GET',
    `position/record/${id}`,
    undefined,
    true,
  ) as Promise<IPosition>;

  /**
   * Validates and retrieves a list of compact position records.
   * @param limit
   * @param startAtOpenTime?
   * @returns Promise<ICompactPosition[]>
   * @throws
   * - 30501: if the number of requested records exceeds the limit
   * - 30502: if the startAtOpenTime is not a valid timestamp
   */
  const listCompactPositions = (
    limit: number,
    startAtOpenTime?: number,
  ): Promise<ICompactPosition[]> => {
    let urlPath: string = `position/records?limit=${limit}`;
    if (typeof startAtOpenTime === 'number') {
      urlPath += `&startAtOpenTime=${startAtOpenTime}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    ) as Promise<ICompactPosition[]>;
  };

  /**
   * Retrieves a list of compact positions that were opened within a date range.
   * @param startAt
   * @param endAt?
   * @returns Promise<ICompactPosition[]>
   * @throws
   * - 30503: if the startAt timestamp is invalid
   * - 30504: if an invalid endAt is provided
   * - 30505: if the startAt is greater than or equals than the endAt
   * - 30506: if the difference between the startAt and the endAt exceeds the limit
   */
  const listCompactPositionsByRange = (
    startAt: number,
    endAt?: number,
  ): Promise<ICompactPosition[]> => {
    let urlPath: string = `position/records/range?startAt=${startAt}`;
    if (typeof endAt === 'number') {
      urlPath += `&endAt=${endAt}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    ) as Promise<ICompactPosition[]>;
  };

  /**
   * Retrieves the history in OHLC format for a position.
   * @param id
   * @returns Promise<IEventHistoryRecord>
   * @throws
   * - 11000: if the id has an invalid format
   * - 11001: if the record was not found in the database
   */
  const getPositionHistory = (id: string): Promise<IEventHistoryRecord> => APIService.request(
    'GET',
    `position/event-history/${id}`,
    undefined,
    true,
  ) as Promise<IEventHistoryRecord>;





  /* **********************************************************************************************
   *                                           HELPERS                                            *
   ********************************************************************************************** */

  /**
   * Retrieves the class name that should be applied to text based on the current gain%.
   * @param gain
   * @returns string
   */
  const getGainClassName = (gain: number): string => {
    if (gain >= 3) {
      return 'text-increase-2';
    }
    if (gain > 0) {
      return 'text-increase-1';
    }
    if (gain <= -3) {
      return 'text-decrease-2';
    }
    if (gain < 0) {
      return 'text-decrease-1';
    }
    return 'text-stateless';
  };




  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // actions
    increasePosition,
    decreasePosition,
    archivePosition,
    unarchivePosition,

    // retrievers
    getPosition,
    listCompactPositions,
    listCompactPositionsByRange,
    getPositionHistory,

    // helpers
    getGainClassName,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const PositionService = positionServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // servuice
  PositionService,

  // types
  type IPosition,
  type ICompactPosition,
};
