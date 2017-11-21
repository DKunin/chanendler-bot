'use strict';

const request = require('superagent');

function asyncPromise(url) {
    return new Promise((resolve, reject) => {
        request(url)
            .set('Accept', 'application/json')
            .end((err, body) => {
                resolve(body);
            })
            .catch(reject);
    });
}

module.exports = asyncPromise;
