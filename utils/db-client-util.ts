import { config as envConfig } from '@config/env-config';
import mssql from 'mssql';
import { logger } from './logger-util';
import { timeouts } from './timeouts-util';

export enum Databases {
    ORCA = 'Orca',
    MCLEAD = 'McLead',
    GROUP = 'Group'
}


/**
 * Builds the MSSQL database configuration object.
 * @param {string} [dbName] - Optional database name to override the default from environment config.
 * @returns {mssql.config} The configuration object for MSSQL connection.
 */
function getDbConfig(dbName?: string): mssql.config {
    const database = dbName || envConfig.SQL_DB;
    const timeoutMs = timeouts.veryLong;
    logger.info(`Preparing DB config for database: ${database}`);
    // Decode Base64 password from env config
    const decodedPassword = Buffer.from(envConfig.SQL_PASSWORD, 'base64').toString('utf-8');
    logger.info('Decoded SQL password from Base64.');
    return {
        server: envConfig.SQL_SERVER.split(':')[0],
        port: parseInt(envConfig.SQL_SERVER.split(':')[1] || '1433'),
        database,
        user: envConfig.SQL_USER,
        password: decodedPassword,
        options: {
            encrypt: false,
            trustServerCertificate: false
        },
        connectionTimeout: timeoutMs,
        requestTimeout: timeoutMs
    };
}

/**
 * Executes a SQL query on the specified database and returns the result set.
 * @template T
 * @param {string} dbName - The name of the database to connect to.
 * @param {string} sql - The SQL query to execute.
 * @returns {Promise<T[]>} The result set as an array of objects.
 */
export async function runQuery<T = any>(
    dbName: string,
    sql: string
): Promise<T[]> {
    const dbConfig = getDbConfig(dbName);
    logger.info(`[DbClient.runQuery] - Connecting to DB: ${dbConfig.server}:${dbConfig.port}, DB: ${dbConfig.database}, User: ${dbConfig.user}`);
    const pool = await mssql.connect(dbConfig);
    try {
        logger.info(`Running query: ${sql}`);
        let request = pool.request();
        const result = await request.query<T>(sql);
        logger.info(`[DbClient.runQuery] - Query executed successfully. Rows returned: ${result.recordset.length}`);
        logger.info(`[DbClient.runQuery] - Result data: ${JSON.stringify(result.recordset, null, 2)}`);
        return result.recordset;
    } finally {
        await pool.close();
        logger.info('[DbClient.runQuery] - Database connection closed.');
    }
}

/**
 * Executes a SQL query and returns a single string value.
 * The query must return a single row with one column (e.g. "SELECT TOP (1) c.email ...").
 * Returns empty string when no rows are returned.
 * @param dbName - database name (use Databases enum)
 * @param sql - SQL query
 */
export async function getStringFromQuery(
    dbName: string,
    sql: string
): Promise<string> {
    logger.info(`[DbClient.getStringFromQuery] - Executing single-value query on DB ${dbName}`);
    const rows = await runQuery<any>(dbName, sql);
    if (!Array.isArray(rows) || rows.length === 0) {
        logger.info('[DbClient.getStringFromQuery] - No rows returned.');
        return '';
    }

    const first = rows[0];

    // For object rows, return the first property value (suitable for single-column queries)
    const values = Object.values(first);
    const value = values.length > 0 ? values[0] : undefined;

    if (value === undefined) {
        throw new Error('[DbClient.getStringFromQuery] - First row has no columns, check your query.');
    }

    return String(value).trim();
}