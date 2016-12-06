'use strict';

const SerialPort = require('serialport');
const instances = {};
module.exports = {
    get: function(comName) {
        if(instances[comName]) {
            return Promise.resolve(instances[comName]);
        }

        return new Promise(function(resolve, reject) {
             var s = new SerialPort(comName, {
                 baudrate: 9600
             });

            s.on('error', reject);
            s.on('open', () => {
                console.log('connection open');
                instances[comName] = s;
                resolve(s);
            });

            s.on('data', function(data) {
                console.log('data', data.toString());
            });

            s.on('disconnect', function() {
                console.log('disconnect');
                s.close(function() {
                    delete instances[comName];
                });
            })
        });
    },

    // printImage(comName) {
    //     this.get(comName).then(serial => {
    //         var buffer = fs.readFileSync('/home/stropitek/Downloads/barbara_test.bmp');
    //         serial.write('! 0 90 193 1\nVARIABLE DARKNESS 150\nPITCH 200\nWIDTH 240\nTEXT 0 4 0 Description line 1\nGRAPHIC BMP 100 100\n\n');
    //         serial.write(buffer);
    //         serial.write('!+ 0 100 200 1\nEND');
    //     });
    // }

    // status: function(comName) {
    //     const maxCount = 10;
    //     const interval = 200;
    //     var response = '';
    //     var last = '';
    //     var count = 0;
    //     return module.exports.get(comName).then(serial => {
    //         return new Promise((resolve, reject) => {
    //             function wait() {
    //                 count++;
    //                 setTimeout(() => {
    //                     if(!last && response) {
    //                         console.log('response');
    //                         return resolve(response);
    //                     } else if(count >= maxCount) {
    //                         console.log('no response')
    //                         reject(new Error('no response'));
    //                     } else {
    //                         last = '';
    //                         wait();
    //                     }
    //                 }, interval);
    //             }
    //             serial.on('data', data => {
    //                 console.log('data', data);
    //                 last = data.toString();
    //                 response += last;
    //             });
    //
    //             wait();
    //             serial.write('!QS');
    //         });
    //     });
    // }
};