'use strict';

const router = require('koa-router')();
const deviceManager = require('../serial/deviceManager');
const raw = require('raw-body');
const inflate = require('inflation');

router.get('/devices/id', function *() {
    this.body = deviceManager.getDeviceIds();
});

// Insert/update format
router.post('/send/:deviceId', function *() {
    var data;
    try {
        if (typeof this.request.body === 'object') {
            const type = Object.prototype.toString.call(this.request.body).slice(8, -1).toLowerCase();
            if (type === 'object' && this.request.body.b64data) {
                console.log('b64data');
                data = Buffer.from(this.request.body.b64data, 'base64');
            } else if (JSON.stringify(this.request.body) === '{}') {
                console.log('raw body');
                data = yield raw(inflate(this.req), {
                    limit: '1mb'
                });
                console.log(data.toString());
            } else {
                this.status = 400;
                handleError.call(this, new Error('Bad arguments'));
                return;
            }
        } else if (typeof this.request.body === 'string') {
            console.log('string');
            data = this.request.body;
        } else {
            console.log('bad');
            this.status = 400;
            handleError.call(this, new Error('Bad arguments'));
            return;
        }
        const res = yield deviceManager.addRequest(this.params.deviceId, data);
        this.body = {
            status: 'success',
            message: res
        }
    } catch (err) {
        this.body = {
            status: 'failed',
            error: err.message
        }
    }
});

function handleError(err) {
    this.body = {
        status: 'failed',
        error: err.message
    };
}

module.exports = router;