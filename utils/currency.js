'use strict';

const request = require('superagent');

module.exports = function(amount, fromCurrency, toCurrency) {
    return new Promise(resolve => {
        request(
            `http://api.fixer.io/latest?symbols=${toCurrency.toUpperCase()}&base=${fromCurrency.toUpperCase()}`
        )
            .set('Accept', 'application/json')
            .end((err, body) => {
                const { rates } = body.body;
                const coef = rates[toCurrency.toUpperCase()];
                resolve((Number(amount) * coef).toFixed(2).toString());
            });
    });
};
