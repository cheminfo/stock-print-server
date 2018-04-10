'use strict';
const getMac = require('getmac').getMac;
const ip = require('ip');
const Roc = require('rest-on-couch-client');
const VERSION = require('../constants').VERSION;
const config = require('../config/config');
const debug = require('debug')('stock-print-server:couchdb-log');

const SECOND = 1000;
const MINUTE = 60 * SECOND;
let intervalId;
exports.start = function (couchDB, interval) {
    interval = interval || 5 * MINUTE;
    const roc = new Roc(couchDB);
    log();
    intervalId = setInterval(() => {
        log();
    }, interval);

    function log() {
        getMac((err, macAddress) => {
            if (err) {
                debug('Could not get mac address', err.message);
                return;
            }
            debug('mac address', macAddress);
            const address = ip.address();
            const protocol = config.server.cert ? 'https' : 'http';
            const content = {
                macAddress, ip: address, version: VERSION, port: config.server.port, protocol,
                url: `${protocol}://${address}:${config.server.port}`,
                type: 'cognitive'
            };
            roc.view('printServerByMacAddress', {
                key: macAddress
            }).then(data => {
                if (!data.length) {
                    return roc.create({
                        $kind: 'printServer',
                        $content: content,
                        $owners: ['printerAdmin']
                    });
                } else {
                    return roc.update(Object.assign(data[0], {$content: content})).then(() => debug('entry added to couchdb'))
                }
            }).catch(err => {
                debug('Error logging printServer to couchdb', err);
            });
        })
    }
};

