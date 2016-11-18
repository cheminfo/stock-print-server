'use strict';

const levelup = require('levelup');
const LevelPromise = require('level-promise');
const config = require('../config/config');
const path = require('path');

module.exports = {
    format: process(LevelPromise(levelup(path.join(config.db.path, 'format'))))
};

function process(db) {
    db.getKeys = function () {
        return new Promise(function(resolve, reject) {
             const keys = [];
             const stream = db.createKeyStream();
             stream.on('data', function(key) {
                 keys.push(key);
             });
             stream.on('error', reject);
             stream.on('end', () => resolve(keys));
        });
    };

    db.getAll = function () {
        return new Promise(function(resolve, reject) {
            const all = [];
            const stream = db.createReadStream();
            stream.on('data', function(data) {
                all.push(data);
            });
            stream.on('error', reject);
            stream.on('end', () => resolve(all));
        });
    };
    return db;
}
