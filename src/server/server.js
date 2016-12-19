const https = require('https');
const koa = require('koa');
var app = koa();
const api = require('./api');
const bodyParser = require('koa-body');
const cors = require('koa-cors');
const config = require('../config/config');
const fs = require('fs');


if(config.log && config.log['rest-on-couch']) {
    const rocLog = require('../db/log');
    rocLog.start(config.log['rest-on-couch'], config.log.interval);
}

if(config.server && config.server.cert) {
    https.createServer({
        key: fs.readFileSync(config.server.cert.key),
        cert: fs.readFileSync(config.server.cert.cert)
    }, app.callback()).listen(8880);
} else {
    app.listen(8880);
}
app.use(cors({origin: '*'}));
app.use(bodyParser());
app.use(api.routes());