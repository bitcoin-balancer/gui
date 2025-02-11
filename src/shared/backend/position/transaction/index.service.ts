import { APIService } from '@/shared/backend/api/index.service.ts';
import {
  ITransactionService,
  ITransactionStatus,
  ITransactionActionName,
  ITransaction,
  ITransactionLog,
} from '@/shared/backend/position/transaction/types.ts';

/* ************************************************************************************************
 *                                         IMPLEMENTATION                                         *
 ************************************************************************************************ */

/**
 * Transaction Service Factory
 * Generates the object in charge of ensuring that position actions get executed properly.
 * @returns ITransactionService
 */
const transactionServiceFactory = (): ITransactionService => {
  /* **********************************************************************************************
   *                                          PROPERTIES                                          *
   ********************************************************************************************** */

  // ...





  /* **********************************************************************************************
   *                                          RETRIEVERS                                          *
   ********************************************************************************************** */

  /**
   * Retrieves a transaction record from the database.
   * @param id
   * @returns Promise<ITransaction>
   * @throws
   * - 32500: if the identifier is invalid
   * - 32000: if the tx is not found in the db
   */
  const getTransaction = (id: number): Promise<ITransaction> => APIService.request(
    'GET',
    `position/transaction/${id}`,
    undefined,
    true,
  );

  /**
   * Retrieves a series of transactions. If the startAtID is provided, it will start at that point
   * exclusively.
   * @param limit
   * @param startAtID?
   * @returns Promise<ITransaction[]>
   * @throws
   * - 32501: if the query limit is larger than the limit
   * - 32502: if the startAtID was provided and is not a valid identifier
   */
  const listTransactions = (
    limit: number,
    startAtID?: number,
  ): Promise<ITransaction[]> => {
    let urlPath: string = `position/transactions?limit=${limit}`;
    if (typeof startAtID === 'number') {
      urlPath += `&startAtID=${startAtID}`;
    }
    return APIService.request(
      'GET',
      urlPath,
      undefined,
      true,
    );
  };





  /* **********************************************************************************************
   *                                         MODULE BUILD                                         *
   ********************************************************************************************** */
  return Object.freeze({
    // properties
    // ...

    // retrievers
    getTransaction,
    listTransactions,
  });
};





/* ************************************************************************************************
 *                                        GLOBAL INSTANCE                                         *
 ************************************************************************************************ */
const TransactionService = transactionServiceFactory();





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export {
  // service
  TransactionService,

  // types
  type ITransactionStatus,
  type ITransactionActionName,
  type ITransaction,
  type ITransactionLog,
};
