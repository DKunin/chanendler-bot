'use strict';

const request = require('superagent');

function asyncPromise(url) {
    return new Promise((resolve, reject) => {
        request(url)
            .set('Accept', 'application/json')
            .end((error, body) => {
                if (error) {
                    reject(error);
                }
                resolve(body);
            });
    });
}

module.exports = asyncPromise;
