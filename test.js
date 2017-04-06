'use strict';
const PirateBay = require('thepiratebay');
    PirateBay.search('Archer')
        .then(results => console.log(results))
        .catch(err => console.log(err));