const redisService = require('./redis.service');
const config = require('../config/config');

module.exports = {

    processRequest: function () {

        try {
            let counterName = config.dbCounterName;

            return redisService.getValue(counterName);

        } catch (e) {
            console.log('Error:', e.stack);
        }

    }

};
