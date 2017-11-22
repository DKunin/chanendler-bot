'use strict';

const request = require('superagent');

function asyncPromise(url) {
    return new Promise((resolve) => {
        request(url)
            .set('Accept', 'application/json')
            .end((err, body) => {
                resolve(body);
            });
    });
}

module.exports = asyncPromise;
