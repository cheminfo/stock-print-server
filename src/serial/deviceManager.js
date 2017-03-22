'use strict';

const DeviceManager = require('serial-requests').DeviceManager;
const serial = require('../config/config').serial;

const deviceManager = new DeviceManager({
    optionCreator: function(portInfo) {
        if (serial.type === 'keyspan' && portInfo.manufacturer && portInfo.manufacturer.startsWith('Keyspan') || serial.type === 'rs232') {
            return {
                baudRate: serial.baudRate,
                getIdCommand: serial.idCommand,
                getIdResponseParser: serial.parseIdCommandResponse
            }
        }
    }
});

deviceManager.refresh();
setInterval(() => deviceManager.refresh(), 60000);

module.exports = deviceManager;
