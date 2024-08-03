

/* ************************************************************************************************
 *                                            SERVICE                                             *
 ************************************************************************************************ */

/**
 * Database Service
 * Object in charge of managing the initialization and teardown of the PostgreSQL connection. It
 * also manages the instantiation of the Pool and exposes it so other modules can read it directly.
 */
type IDatabaseService = {
  // properties
  // ...

  // database summary
  getDatabaseSummary: () => Promise<IDatabaseSummary>;
};





/* ************************************************************************************************
 *                                             TYPES                                              *
 ************************************************************************************************ */

/**
 * Table Name
 * Each table has a unique name. However, the API creates a test version of each table to be used in
 * unit and integration tests.
 */
type ITableName = 'api_errors' | 'users' | 'password_updates' | 'refresh_tokens' | 'ip_blacklist'
| 'record_stores';

/**
 * Database Summary Table
 * The essential information about an existing table that will be included in the summary.
 */
type IDatabaseSummaryTable = {
  // the name of the table
  name: ITableName;

  // the total size of the table in bytes
  size: number;
};

/**
 * Database Summary
 * The essential information regarding the state of the database.
 */
type IDatabaseSummary = {
  // the name of the database
  name: string;

  // the version of PostgreSQL
  version: string;

  // the total size of the database in bytes
  size: number;

  // the port in which the database is running
  port: number;

  // the list of tables that comprise the database
  tables: IDatabaseSummaryTable[];
};





/* ************************************************************************************************
 *                                         MODULE EXPORTS                                         *
 ************************************************************************************************ */
export type {
  // service
  IDatabaseService,

  // types
  ITableName,
  IDatabaseSummaryTable,
  IDatabaseSummary,
};
