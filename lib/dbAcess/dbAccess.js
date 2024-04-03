'use strict';

/**
 * @file dbAccess.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @summary Database Access (PostgreSQL)
 * @module be-api/lib/dbAccess
 * @requires lib/logger/logger.js
 * @requires node_modules/pg
 */

/**
 * @desc Database Access Requires
 */
const libPath = "../";
const logger = require('logger');
const pg = require('pg');

/**
 * @desc Database Access Exports
 */
module.exports = DB;

/**
 * @function module:be-api/lib/dbAccess.DB
 * @description {DB function}
 * @param {object} dbSettings {dbSettings}
 */
function DB(db_settings, db_access)
{
    let database = null;
    let settings = db_settings[0] || '';
    let dbUserPassword = { 'user': db_access.user, 'password': db_access.password };
    let client = null;
    settings.user = dbUserPassword.user;
    settings.password = dbUserPassword.password;

    this.connect = connect;
    this.end = end;
    this.release = release;
    this.query = query;

    /**
     * @function module:be-api/lib/dbAccess.DB.query
     * @description {Query function}
     * @param {object} sql          {sql}
     * @param {object} args         {args}
     * @param {object} callback     {callback}
     */
    function query(sql, args, callback)
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                let ans = await database.query(sql, args || null, callback || null);
                resolve(ans);

            } catch (e)
            {
                reject(e);
            }
        });
    }

    /**
     * @function module:be-api/lib/dbAccess.DB.connect
     * @description {Connect function}
     */
    function connect()
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                database = new pg.Client(settings)

                client = await database.connect();

                logger.debug('[database][connection]: ok');
                resolve();
            }
            catch (e)
            {
                logger.error("[database][connection] ->", e.message);
                reject(e);
            }
        });
    }

    /**
     * @function module:be-api/lib/dbAccess.DB.release
     * @description {Release function}
     */
    function release()
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                if (client && client.release)
                {
                    await client.release();
                    logger.debug('[database][release]: ok');
                }
                resolve();
            }
            catch (e)
            {
                logger.error("[database][release] ->", e);
                reject(e);
            }
        });
    }

    /**
     * @function module:be-api/lib/dbAccess.DB.end
     * @description {End function}
     */
    function end()
    {
        return new Promise(async (resolve, reject) =>
        {
            try
            {
                await database.end();
                database = null;
                logger.debug('[database][end]: ok');
                resolve();
            }
            catch (e)
            {
                database = null;
                logger.error("[database][end] ->", e);
                reject(e);
            }
        });
    }
}