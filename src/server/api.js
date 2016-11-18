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

router.get('/db/format/names', function * () {
     // get available format names
    this.body = yield dbs.format.getKeys();
});

router.get('/db/format', function * () {
    // get formats
    this.body = yield dbs.format.getAll();
});

router.get('/db/format/:name', function * () {
    // get format
    var entry = yield dbs.format.get(this.params.name);
    this.body = JSON.parse(entry);
});

router.delete('/db/format/:name', function * () {
    yield dbs.format.del(this.params.name);
    this.body = {
        success: true
    };
});

router.post('/print', function * () {
    printer.print(this.request.body);
    this.body = {sent: true};
});

module.exports = router;