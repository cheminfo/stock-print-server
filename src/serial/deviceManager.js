'use strict';

const DeviceManager = require('serial-requests').DeviceManager;
const config = require('../config/config');

const serial = config.serial || 'rs232';

const deviceManager = new DeviceManager({
    optionCreator: function(portInfo) {
        if (serial === 'keyspan' && portInfo.manufacturer && portInfo.manufacturer.startsWith('Keyspan') || serial === 'rs232') {
            return {
                baudRate: config.serial.baudRate,
                getIdCommand: config.serial.idCommand,
                getIdResponseParser: function (buffer) {
                    var m = /^Host Name = (.*)\r\n$/.exec(buffer);
                    if (m && m[1]) {
                        return m[1];
                    }
                    throw new Error('Could not parse id response')
                }
            }
        }
    }
});

deviceManager.refresh();
setInterval(() => deviceManager.refresh(), 60000);

module.exports = deviceManager;
