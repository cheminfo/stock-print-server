'use strict';

const DeviceManager = require('serial-requests').DeviceManager;

const data = [23,23,23, 23, 23, 67, 76, 69, 65, 82, 23, 23, 23, 23, 23].map(String.fromCharCode).join('');
const deviceManager = new DeviceManager({
    optionCreator: function(portInfo) {
        if (portInfo.manufacturer === 'Keyspan') {
            return {
                baudRate: 38400,
                getIdCommand: data + '\n' + '!SHOW HOST_NAME\n',
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