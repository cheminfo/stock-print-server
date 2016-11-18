'use strict';

const serialport = require('serialport');

function getPorts() {
    return new Promise(function (resolve, reject) {
        serialport.list(function (err, ports) {
            if (err) reject(err);
            resolve(ports);
        });
    });
}

module.exports = {
    getPorts
};