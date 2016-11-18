const koa = require('koa');
var app = koa();
const api = require('./api');
const bodyParser = require('koa-body');
app.listen(8880);

app.use(bodyParser());
app.use(api.routes());