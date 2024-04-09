'use strict';

/**
 * @file clients.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc Clients Controller of be-api
 * @module be-api/controllers/clients
 * @requires lib/logger/logger.js
 * @requires models/clients.js
 */

/**
 * @desc Clients Controller Requires
 */
const logger = require('../../lib/logger/logger');
const model = require('../models/clients');

/**
 * @desc Clients Controller Export 'get' - Method: GET - Call model 'getClients'
 */
exports.get = ('/', (req, res, next) =>
{
    logger.log("[be-api][controller][clients][Method: " + req.method + "][URI: " + req.originalUrl + "]");

    let filter = req?.query || null;

    model.getClients(null, filter, function (err, ans)
    {
        if (err)
        {
            res.status(404).json({
                message: err.message || err.error_entry || err.error_return
            });
            return;
        }
        else if (ans.total > 0)
        {
            res.status(200).json({
                total: ans.total,
                content: ans.content
            });
        }
        else
        {
            logger.warn("[be-api][controller][clients][Method: " + req.method + "][NOT_FOUND: " + req.originalUrl + "]");

            res.status(200).json({
                total: ans.total,
                message: "NOT_FOUND"
            });
        }
    });
});

/**
 * @desc Clients Controller Export 'getID' - Method: GET with id_client - Call model 'getClients'
 */
exports.getID = ('/:id', (req, res, next) =>
{
    let id = req.params.id;
    let regexID = /^\d+$/;

    if (regexID.test(id))
    {
        logger.log("[be-api][controller][clients][Method: " + req.method + "][URI: " + req.originalUrl + "]");

        id = parseInt(id);

        model.getClients(id, null, function (err, ans)
        {
            if (err)
            {
                res.status(404).json({
                    message: err.message || err.error_entry || err.error_return
                });
                return;
            }
            else if (ans.total > 0)
            {
                res.status(200).json({
                    total: ans.total,
                    id: id,
                    content: ans.content
                });
            }
            else
            {
                logger.warn("[be-api][controller][clients][Method: " + req.method + "][CLIENT_NOT_FOUND: " + req.originalUrl + "]");

                res.status(200).json({
                    total: ans.total,
                    id: id,
                    message: "CLIENT_NOT_FOUND"
                });
            }
        });
    }
    else
    {
        logger.error("[be-api][controller][clients][Method: " + req.method + "][INVALID_PARAMETER: " + req.originalUrl + "]");

        res.status(400).json({
            message: 'INVALID_PARAMETER'
        });
    }
});