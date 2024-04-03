'use strict';

/**
 * @file index.js
 * @author Caio Carvalho <caaiosin@gmail.com>
 * @desc API, responsible for delivering information to all
 * @module be-api/be-api
 * @requires lib/logger/logger.js
 * @requires config/settingsLoader.js
 * @requires lib/dbAccess/dbAccess.js
 * @requires node_modules/express/index.js
 * @requires node_modules/compression/index.js
 * @requires node_modules/body-parser/index.js
 * @requires src/routes.js
 * @requires controllers/routes.js
 */

/**
 * @desc API Requires
 */
const logger = require('./lib/logger/logger.js');
const express = require('express');
const bodyParser = require('body-parser');
const compression = require('compression');
const settingsLoader = require('./settings/settingsLoader.js');
// const DB = require('../../lib/dbAccess/dbAccess');

/**
 * @desc be-api Settings
 */
const app = express();
const version = settingsLoader.version;
// const settings = settingsLoader.api["db_config"];
const port = settingsLoader.port;
let interval = 10000;
let dbUser = {};

logger.setMinTime(settingsLoader.api.log.time);
logger.setLevel(settingsLoader.api.log.level);

/**
 * @desc be-api global
 */
// global.startDatabase = startDatabase;

/**
 * @desc be-api Routes
 * @requires src/routes.js
 */
const routes = require('./src/routes/index.js');

/**
 * @desc be-api Authenticate
 * @requires controllers/authenticate.js
 */
// const authenticateController = require('./controllers/authenticate');

/**
 * @desc be-api Main
 */
main();

/**
 * @function module:be-api/be-api.main
 * @description {Main function}
 */
async function main() {
    try {
        await startServer();
        // await authenticateAPI();

        app.use(compression());
        app.use(bodyParser.json({ limit: '100mb' }));
        app.use(bodyParser.urlencoded({ extended: false }));
        app.use(version, routes);
    }
    catch (e) {
        logger.error("[be-api][error][Trying again in 10 seconds...]");
        setTimeout(main, interval);
    }
}

/**
 * @function module:be-api/be-api.authenticateAPI
 * @description {Authenticate API function}
 */
function authenticateAPI() {
    return new Promise(async function (resolve, reject) {
        let ret = 0;
        let attempts = 5;

        for (let i = 0; i < attempts; i++) {
            try {
                ret = await authenticateController.getConsul();
                break;
            }
            catch (e) {
                logger.log("[be-api][authenticateAPI][Trying again...]");
                await sleep(10000);
            }
        }

        if (ret == 0) {
            logger.error("[be-api][authenticateAPI][Trying again in 10 seconds...]");
            setTimeout(async function () {
                await authenticateAPI();
            }, interval);
        }

        try {
            if (Object.keys(ret).length) {
                let userInformation = await authenticateController.decode(ret);
                userInformation = JSON.parse(userInformation);

                dbUser["user"] = userInformation.user;
                dbUser["password"] = userInformation.password;

                global.db = await startDatabase();
            }
            resolve();
        }
        catch (e) {
            logger.error("[be-api][authenticateAPI][Trying again in 10 seconds...]");
            setTimeout(async function () {
                await authenticateAPI();
            }, interval);
        }
    });
}

/**
 * @function module:be-api/be-api.startServer
 * @description {Server start function}
 */
function startServer() {
    return new Promise((resolve, reject) => {
        try {
            require('http').createServer(app).listen(port);

            logger.log("[be-api] be-api started on port: " + port);

            resolve();
            return;
        }
        catch (e) {
            logger.log("[be-api] be-api not started");
            reject();
            return e;
        }
    });
}

/**
 * @function module:be-api/be-api.startDatabase
 * @description {Database start function}
 */
function startDatabase() {
    return new Promise(async (resolve, reject) => {
        let db;

        try {
            /**
             * @let {object} global.db
             * @description Will become a single database connection
             */
            db = new DB([settings], dbUser);
            await db.connect();
            resolve(db);
        }
        catch (e) {
            reject(e);
        }
    });
}

/**
 * @function module:be-api/be-api.sleep
 * @description {Function to sleep}
 */
function sleep(time) {
    return new Promise((resolve) => {
        setTimeout(resolve, time, false);
    });
}

/**
 * @function module:be-api/be-api.exitAPI
 * @description {Function to exit be-api}
 */
async function exitAPI() {
    let db = global.db;

    if (db) {
        await db.end();
    }

    logger.log("[be-api] Shutting down be-api");
    process.exit(0);
}

process.on('SIGTERM', exitAPI);

process.on('SIGINT', exitAPI);

if (process.platform === "win32") {
    let rl = require("readline").createInterface({
        "input": process.stdin,
        "output": process.stdout
    });
    rl.on("SIGINT", () => {
        process.emit("SIGINT");
    });
}