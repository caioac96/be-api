'use strict';

/**
 * @file routes.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc Routes of be-api
 * @module be-api/src/routes
 * @requires node_modules/express/index.js
 */

/**
 * @desc Routes Requires
 */
const express = require('express');
const router = express.Router();

/**
 * @desc Routes - Controllers Requires
 */
/** Generic */
const controllerIndex = require('../controllers/index');
const controllerClients = require('../controllers/clients');

/**
 * @desc Index Method [generic]
 */
router.get('/', controllerIndex.get);

/**
 * @desc Clients Methods - Call controllers [generic]
 */
router.get('/clients', controllerClients.get);
router.get('/client/:id', controllerClients.getID);

/**
 * @desc Server Exports
 */
module.exports = router;