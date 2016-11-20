'use strict';

const SerialPort = require('serialport');
const instances = {};
module.exports = {
    get: function(comName) {
        if(instances[comName]) {
            return Promise.resolve(instances[comName]);
        }

        return new Promise(function(resolve, reject) {
             var s = new SerialPort(comName, {
                 baudrate: 9600
             });

            s.on('error', reject);
            s.on('open', () => {
                instances[comName] = s;
                resolve(s);
            });
        });
    }
};