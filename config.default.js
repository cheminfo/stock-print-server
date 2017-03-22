'use strict';

module.exports = {
    log: {
        interval: 300000
    },
    'rest-on-couch': {
        url: 'https://eln.cheminfo.org/roc/',
        database: 'printers',
        username: 'printer@cheminfo.org',
        password: 'password',
        authTimeout: 550000
    },
    serial: {
        type: 'rs232', // Replace if needed by 'keyspan'
        baudRate: 9600,
        idCommand: '!SHOW HOST_NAME\n',
        parseIdCommandResponse: str => {
            var m = /^Host Name = (.*)\r\n$/.exec(str);
            if (m && m[1]) {
                return m[1];
            }
            throw new Error('Could not parse id response')
        }
    }
};
