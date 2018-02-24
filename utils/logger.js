'use strict';

const bunyan = require('bunyan');

module.exports = () => {
    const logger = bunyan.createLogger({ name: 'chanandler-bong' });

    logger.addStream({
        path: './logs/main.log'
    });

    return logger;
};
