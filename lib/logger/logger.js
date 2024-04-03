/**
 * @file logger.js
 * @summary Log Library
 * @module be-api/lib/logger
 * @requires util
 */

/**
 * @desc Log Library Requires
 */
let util = require('util');

if (!global.loggerLevel)
{
    global.loggerLevel = 'info';
}

if (!global.loggerMinTime)
{
    global.loggerMinTime = 1000;
}

if (!global.loggerTime)
{
    global.loggerTime = {};
}

exports.setLevel = function (newLevel)
{
    if (newLevel === 'debug' || newLevel === 'info' || newLevel === 'warn' || newLevel === 'error')
    {
        global.loggerLevel = newLevel;
    }
}

exports.setMinTime = function (newMinTime)
{
    if (Number.isInteger(newMinTime))
    {
        global.loggerMinTime = newMinTime;
    }
}

exports.debug = function ()
{
    let level = global.loggerLevel;

    if (level === 'debug')
    {
        console.log('\x1b[32m' + util.format.apply(this, arguments) + '\x1b[0m');
    }
}
exports.log = function ()
{
    let level = global.loggerLevel;
    if (level === 'debug' || level === 'info')
    {
        console.log(util.format.apply(this, arguments));
    }
};

exports.warn = function ()
{
    let level = global.loggerLevel;

    if (level === 'debug' || level === 'info' || level === 'warn')
    {
        console.log('\x1b[33mWARN:', util.format.apply(this, arguments) + '\x1b[0m');
    }
}
exports.error = function ()
{
    let level = global.loggerLevel;

    if (level === 'debug' || level === 'info' || level === 'warn' || level === 'error')
    {
        console.log('\x1b[31mERROR:', util.format.apply(this, arguments) + '\x1b[0m');
    }
}

exports.time = function (label)
{
    if (Array.isArray(global.loggerTime[label]))
    {
        global.loggerTime[label].push(Date.now());
    }
    else
    {
        global.loggerTime[label] = [Date.now()];
    }
}

exports.timeEnd = function (label)
{
    let time = null;
    let level = global.loggerLevel;
    if (Array.isArray(global.loggerTime[label]) && global.loggerTime[label].length)
    {
        time = global.loggerTime[label].shift();
    }
    if (!time)
    {
        // throw new Error('No such label: ' + label);
        console.log('No such label: ' + label);
        return;
    }
    if (!global.loggerTime[label].length)
    {
        delete global.loggerTime[label];
    }
    let duration = Date.now() - time;

    if (duration >= global.loggerMinTime && (level === 'debug' || level === 'info'))
    {
        console.log('%s: %dms', label, duration);
    }
    return duration;
}

let _log = console.log;

console.log = function ()
{
    var newData = [timestamp() + ' - ' + util.format.apply(this, arguments)];
    _log.apply(console, newData);
}

function timestamp() 
{
    let d = new Date();
    let time = [pad(d.getHours()),
    pad(d.getMinutes()),
    pad(d.getSeconds())].join(':');
    return [[d.getFullYear(), pad(d.getMonth() + 1), pad(d.getDate())].join('-'), time].join(' ');
}

function pad(n) 
{
    return n < 10 ? '0' + n.toString(10) : n.toString(10);
}
