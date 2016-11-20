'use strict';

const serial = require('../serial/serial');
const format = require('../db/dbs').format;
const twig = require('twig');
module.exports = {
    print: function *(data) {
        console.log(data);
        var f = yield format.get(data.format);
        f = JSON.parse(f);
        console.log('format', f);
        var template = twig.twig({
            data: f.twig
        });
        var toSend = template.render(data.data);
        var s = yield serial.get(f.comPort);
        console.log(toSend);
        s.write(toSend);
        return toSend;
    }
};
