'use strict';
const getMac = require('getmac').getMac;
const ip = require('ip');
const Roc = require('rest-on-couch-client');
const VERSION = require('../constants').VERSION;

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
                console.error('Could not get mac address', err.message);
                return;
            }
            const address = ip.address();
            const content = {
                macAddress, ip: address, version: VERSION
            };
            roc.view('printServerByMacAddress', {
                key: macAddress
            }).then(data => {
                if (!data.length) {
                    return roc.create({
                        $kind: 'printServer',
                        $content: content
                    });
                } else {
                    return roc.update(Object.assign(data[0], {$content: content}))
                }
            }).catch(err => {
                console.error('Error logging printServer to couchdb', err);
            });
        })
    }
};

