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
                all.push({
                    key: data.key,
                    value: JSON.parse(data.value)
                });
            });
            stream.on('error', reject);
            stream.on('end', () => resolve(all));
        });
    };

    db.getKeysByKind = function (kind) {
        return db.getByKind(kind).then(els => els.map(el => el.key));
    };

    db.getByKind = function (kind) {
        return db.getAll().then(all => {
            return all.filter(el => el.value.kind === kind);
        });
    };
    return db;
}
