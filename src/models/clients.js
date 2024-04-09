'use strict';

/**
 * @file clients.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc Clients Model of be-api
 * @module be-api/models/clients
 * @requires lib/logger/logger.js
 * @requires node_modules/ajv/lib/ajv.js
 */

/**
 * @desc Clients Model Requires
 */
const logger = require('../../lib/logger/logger');
const ajv = new require('ajv')({ v5: true, validateSchema: 'log' });

/**
 * @desc Clients Model Exports
 */
exports.getClients = getClients;

/**
 * @function module:be-api/models/clients.getClients
 * @description {Get function}
 * @param {integer} id        {id to get}
 * @param {object} filter     {filter from controller}
 * @param {object} callback   {callback}
 */
async function getClients(id, filter, callback)
{
    if (!ajv.validate(schemaEntry, filter))
    {
        logger.error('[be-api][models][clients][getClients][entry]' + JSON.stringify(ajv.errors));
        callback({ "error_entry": "Filter is invalid" }, null);
        return;
    }

    /**
     * @let {object} global.db
     * @description Global variable instantiated in the main file (be-api.js), loading the database connection
     */
    let db = global.db;

    let args = [];
    let sql = " SELECT id_client, description, tags, id_parent FROM clients WHERE date_deleted IS NULL ";

    if (id)
    {
        args = [id];
        sql += " AND id_client = $1 "

        logger.time('[be-api][models][clients][getClient]');

        try
        {
            let ans = await db.query(sql, args);

            logger.timeEnd('[be-api][models][clients][getClient]');

            let ret = {};
            ret.content = {};
            ret.content = ans.rows || [];
            ret.total = ans.rowCount || 0;

            if (!ajv.validate(schemaReturn, ret))
            {
                logger.error('[be-api][models][clients][getClient][return]' + JSON.stringify(ajv.errors));
                callback({ "error_return": "Return is invalid" }, null);
                return;
            }

            callback(null, ret);
            return;
        }
        catch (err)
        {
            logger.timeEnd('[be-api][models][clients][getClient]');
            logger.error('[be-api][models][clients][getClient][' + err + ']');
            callback(err, null);
            return;
        }
    }
    else
    {
        logger.time('[be-api][models][clients][getClients]');

        try
        {
            if (Object.keys(filter).length > 0)
            {
                if (filter.id_parent)
                {
                    sql += " AND id_parent = " + filter.id_parent + " ";
                }
                if (filter.name)
                {
                    sql += " AND unaccent(description->>'name') ILIKE unaccent('%" + filter.name + "%') ";
                }
                if (filter.email)
                {
                    sql += " AND description->>'email' ILIKE '%" + filter.email + "%' ";
                }
                if (filter.cnpj)
                {
                    sql += " AND description->>'cnpj' LIKE '%" + filter.cnpj + "%' ";
                }
                if (filter.ids_clients)
                {
                    sql += 'AND (';

                    let idsClients = !Array.isArray(filter.ids_clients) ? filter.ids_clients.split(',') : filter.ids_clients;                
                    let cond = '';

                    for (const id in idsClients)
                    {
                        sql += " " + cond + " id_client = " + idsClients[id] + " ";
                        cond = 'OR';
                    }

                    sql += ' ) ';
                }
                if (filter.orderby)
                {
                    if (filter.orderby == 'id_parent')
                    {
                        sql += " ORDER BY id_parent ";
                    }
                    else if (filter.orderby == 'name')
                    {
                        sql += " ORDER BY description->>'name' ";
                    }
                    else if (filter.orderby == 'email')
                    {
                        sql += " ORDER BY description->>'email' ";
                    }
                    else if (filter.orderby == 'cnpj')
                    {
                        sql += " ORDER BY description->>'cnpj' ";
                    }
                    else if (filter.orderby == 'id_client')
                    {
                        sql += " ORDER BY id_client ";
                    }
                    if (filter.sort)
                    {
                        if (filter.sort == 'DESC')
                        {
                            sql += ' DESC ';
                        }
                        else if (filter.sort == 'ASC')
                        {
                            sql += ' ASC ';
                        }
                    }
                }
            }
            else
            {
                sql += " ORDER BY id_client ";
            }

            let ans = await db.query(sql, null);

            logger.timeEnd('[be-api][models][clients][getClients]');

            let ret = {};
            ret.content = {};
            ret.content = ans.rows || [];
            ret.total = ans.rowCount || 0;

            if (!ajv.validate(schemaReturn, ret))
            {
                logger.error('[be-api][models][clients][getClients][return]' + JSON.stringify(ajv.errors));
                callback({ "error_return": "Return is invalid" }, null);
                return;
            }

            callback(null, ret);
            return;
        }
        catch (err)
        {
            logger.timeEnd('[be-api][models][clients][getClients]');
            logger.error('[be-api][models][clients][getClients][' + err + ']');
            callback(err, null);
            return;
        }
    }
}

/**
 * @desc Schema to validate entry
 */
let schemaEntry = {
    type: ['object', 'null'],
    properties: {
        "id_parent": {
            "type": "string",
            "pattern": "^[0-9]+"
        },
        "name": {
            "type": "string",
            "pattern": "[a-zA-Z0-9]+"
        },
        "email": {
            "type": "string",
            "pattern": "[a-zA-Z-.@_0-9]+"
        },
        "cnpj": {
            "type": "string",
            "pattern": "[-._\/0-9]+"
        },
        "orderby": {
            "type": "string",
            "pattern": "[a-z]+"
        }
    }
};

/**
 * @desc Schema to validate return
 */
let schemaReturn = {
    type: 'object',
    properties: {
        'total': { type: 'integer' },
        'content': {
            type: 'array',
            items: {
                type: 'object'
            }
        }
    },
    required: ['total', 'content']
};

/**
 * @desc Schema to validate return just IDS
 */
let schemaReturnIDS = {
    type: 'object',
    properties: {
        'total': { type: 'integer' },
        'id_client': { type: 'array' }
    },
    required: ['total', 'id_client']
};