'use strict';

const serialport = require('serialport');
const instances = {};
module.exports = {
    get: function(port) {
        if(instances[port]) {
            return Promise.resolve(instances[port]);
        }

        return new Promise(function(resolve, reject) {
             var s = new serialport(port, {
                 baudrate: 9600
             });
             s.open(function(err) {
                 if(err) {
                     reject(err);
                 } else {
                     instances[port] = s;
                     resolve(s);
                 }
             });
        });
    }
};