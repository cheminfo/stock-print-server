'use strict';

const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const def = require('./default');

var configFile = getPath('config.js');

if(argv.config) {
    configFile =  getPath(argv.config);
}

function getPath(p) {
    return path.resolve(path.join(__dirname, '../..'), p);
}

const config = require(configFile);

config.server = Object.assign({}, def.server, config.server);
if(config.server && config.server.cert) {
    config.server.cert.key = getPath(config.server.cert.key);
    config.server.cert.cert = getPath(config.server.cert.cert);
}

module.exports = config;
