import { getBigNumber, processValue } from 'bignumber-utils';
import { APIService } from '@/shared/backend/api/index.service.ts';
import { IEventHistoryRecord } from '../candlestick/index.service.js';
import { ITrade } from '../exchange/index.service.js';
import { IManualTrade } from './trade/index.service.js';
import { ITransaction } from './transaction/index.service.js';
import {
  IPositionService,
  IPositionAction,
  IDecreaseActions,
  IPosition,
  ICompactPosition,
} from './types.js';

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
   * - 30512: if the positon is currently active
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

  /**
   * Retrieves all the trades that were executed in a position.
   * @param id
   * @returns Promise<ITrade[]>
   * @throws
   * - 30500: if the ID is not a valid uuid v4
   * - 30000: if the positition is not found in the db
   */
  const listPositionTrades = (id: string): Promise<ITrade[]> => APIService.request(
    'GET',
    `position/record/trades/${id}`,
    undefined,
    true,
  ) as Promise<ITrade[]>;

  /**
   * Retrieves all the transactions that were executed in a position.
   * @param id
   * @returns Promise<ITransaction[]>
   * @throws
   * - 30500: if the ID is not a valid uuid v4
   * - 30000: if the positition is not found in the db
   */
  const listPositionTransactions = (id: string): Promise<ITransaction[]> => APIService.request(
    'GET',
    `position/record/transactions/${id}`,
    undefined,
    true,
  ) as Promise<ITransaction[]>;





  /* **********************************************************************************************
   *                                      TRADE MANAGEMENT                                        *
   ********************************************************************************************** */

  /**
   * Validates and creates a trade record for the active position.
   * @param trade
   * @param otpToken
   * @returns Promise<ITrade>
   * @throws
   * - 33500: if the record is not an object
   * - 33501: if the event_time is an invalid
   * - 33502: if the timestamp is set ahead of time
   * - 33503: if the side of the record is invalid
   * - 33504: if the notes are invalid
   * - 33505: if the price is invalid
   * - 33506: if the amount is invalid
   * - 30513: if there isn't an active position
   * - 30517: if the timestamp of the trade is older than the position's open time
   * - 30514: if there no items in the list of trades
   * - 30515: if the state causes the amount to be less than 0
   * - 30516: if the state causes the entry price to be less than or equals to 0
   * - 30519: if the first trade is a sell
   */
  const createTrade = (trade: IManualTrade, otpToken: string): Promise<ITrade> => (
    APIService.request(
      'POST',
      'position/trade',
      { trade },
      true,
      otpToken,
    ) as Promise<ITrade>
  );

  /**
   * Validates and updates a trade record for the active position.
   * @param id
   * @param trade
   * @param otpToken
   * @returns Promise<ITrade>
   * @throws
   * - 33500: if the record is not an object
   * - 33501: if the event_time is an invalid
   * - 33502: if the timestamp is set ahead of time
   * - 33503: if the side of the record is invalid
   * - 33504: if the notes are invalid
   * - 33505: if the price is invalid
   * - 33506: if the amount is invalid
   * - 30513: if there isn't an active position
   * - 30517: if the timestamp of the trade is older than the position's open time
   * - 33507: if the record's ID has an invalid format
   * - 30518: if the trade doesn't exist
   * - 30514: if there no items in the list of trades
   * - 30515: if the state causes the amount to be less than 0
   * - 30516: if the state causes the entry price to be less than or equals to 0
   * - 30519: if the first trade is a sell
   */
  const updateTrade = (id: number, trade: IManualTrade, otpToken: string): Promise<ITrade> => (
    APIService.request(
      'PUT',
      `position/trade/${id}`,
      { trade },
      true,
      otpToken,
    ) as Promise<ITrade>
  );

  /**
   * Validates and deletes a trade record from the active position.
   * @param id
   * @returns Promise<void>
   * @throws
   * - 33500: if the record is not an object
   * - 33501: if the event_time is an invalid
   * - 33502: if the timestamp is set ahead of time
   * - 33503: if the side of the record is invalid
   * - 33504: if the notes are invalid
   * - 33505: if the price is invalid
   * - 33506: if the amount is invalid
   * - 30513: if there isn't an active position
   * - 30517: if the timestamp of the trade is older than the position's open time
   * - 30514: if there no items in the list of trades
   * - 30515: if the state causes the amount to be less than 0
   * - 30516: if the state causes the entry price to be less than or equals to 0
   * - 30519: if the first trade is a sell
   * - 30518: if the trade doesn't exist
   */
  const deleteTrade = (id: number, otpToken: string): Promise<void> => (
    APIService.request(
      'DELETE',
      `position/trade/${id}`,
      undefined,
      true,
      otpToken,
    ) as Promise<void>
  );





  /* **********************************************************************************************
   *                                           HELPERS                                            *
   ********************************************************************************************** */

  /**
   * Retrieves the class name that should be applied to text based on the PNL.
   * @param pnl
   * @returns string
   */
  const getPNLClassName = (pnl: number): string => {
    if (pnl > 0) {
      return 'text-increase-1';
    }
    if (pnl < 0) {
      return 'text-decrease-1';
    }
    return '';
  };

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
    return '';
  };

  /**
   * Calculates the amount that will be decreased from a position.
   * @param positionAmount
   * @param percentage
   * @returns number
   */
  const calculateDecreaseAmount = (
    positionAmount: number,
    percentage: number,
  ): number => processValue(
    getBigNumber(positionAmount).times(percentage / 100),
    { decimalPlaces: 4, roundingMode: 'ROUND_HALF_DOWN' },
  );





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
    listPositionTrades,
    listPositionTransactions,

    // trade management
    createTrade,
    updateTrade,
    deleteTrade,

    // helpers
    getPNLClassName,
    getGainClassName,
    calculateDecreaseAmount,
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
  type IPositionAction,
  type IDecreaseActions,
  type IPosition,
  type ICompactPosition,
};
