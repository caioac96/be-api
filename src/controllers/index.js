'use strict';

/**
 * @file index.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc Index Controller of be-api
 * @module be-api/controllers/index
 * @requires lib/logger/logger.js
 * @requires config/settingsLoader.js
 */

/**
 * @desc Index Controller Requires
 */
const logger = require('../../lib/logger/logger.js');
const settingsLoader = require('../../settings/settingsLoader.js');
const version = settingsLoader.version;

/**
 * @desc Index Controller Export 'get' - Method: GET
 */
exports.get = ('/', (req, res, next) => {
    logger.log("[be-api][controller][index][Method: " + req.method + "][URI: " + req.originalUrl + "]");

    res.status(200).send({
        message: "API - version: " + version,
        uri: req.originalUrl
    });
});