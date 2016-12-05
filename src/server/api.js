'use strict';

const serialUtil = require('../serial/util');
const dbs = require('../db/dbs');
const printer = require('../printer/printer');

const router = require('koa-router')();

router.get('/ports', function * (next) {
    const ports = yield serialUtil.getPorts();
    this.body = ports.filter(port => port.manufacturer);
});

router.put('/db/format', function * () {
    // Save a print format
    console.log(this.request.body);
    const key = this.request.body.key;
    const value = this.request.body.value;
    yield dbs.format.put(key, JSON.stringify(value));
    this.body = {
        success: true
    }
});

// Get formats
router.get('/db/format', function * () {
    // get formats
    this.body = yield dbs.format.getAll();
});

router.get('/db/format/:name', function * () {
    // get format
    const entry = yield dbs.format.get(this.params.name);
    this.body = JSON.parse(entry);
});

router.get('/db/format/kind/:kind', function * () {
    this.body = yield dbs.format.getByKind(this.params.kind);
});

// Get format names
router.get('/db/format/names', function * () {
     // get available format names
    this.body = yield dbs.format.getKeys();
});

router.get('/db/format/kind/:kind/names', function * () {
    this.body = yield dbs.format.getKeysByKind(this.params.kind);
});

// Delete format
router.delete('/db/format/:name', function * () {
    yield dbs.format.del(this.params.name);
    this.body = {
        success: true
    };
});

// Insert/update format
router.post('/print', function * () {
    console.log('print');
    console.log(this.request.body);
    var sent = yield printer.print(this.request.body);
    console.log(sent);
    this.body = {sent};
});

module.exports = router;