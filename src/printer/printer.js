'use strict';

const serial = require('../serial/serial');
const format = require('../db/dbs').format;
const twig = require('twig');
module.exports = {
    print: function * (data) {
        var f = yield format.get(data.format);
        f = JSON.parse(f);
        var toSend = twig.render(f.twig, data.data);
        // var s = yield serial.get(f.port);
        console.log(toSend);
        //s.write(toSend);
    }
};
