'use strict';

const yaml = require('js-yaml');
const argv = require('minimist')(process.argv.slice(2));
const fs = require('fs');
const path = require('path');

var configFile = getPath('config.yml');

if(argv.config) {
    configFile =  getPath(argv.config);
}

function getPath(p) {
    return path.resolve(path.join(__dirname, '../..'), p);
}

const config = yaml.safeLoad(fs.readFileSync(configFile));

if(config.server && config.server.cert) {
    config.server.cert.key = getPath(config.server.cert.key);
    config.server.cert.cert = getPath(config.server.cert.cert);
}
module.exports = config;
