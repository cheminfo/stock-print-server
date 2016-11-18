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
module.exports = yaml.safeLoad(fs.readFileSync(configFile));
