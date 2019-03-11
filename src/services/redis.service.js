let redis = require('redis');
const redisSetting = require('../config/config').redisSetting;
let client = redis.createClient(redisSetting.port, redisSetting.host);

client.on('connect', function () {
    console.log('Redis client connected');
});

client.on('error', function (err) {
    console.log('Something went wrong ' + err);
});

module.exports = {

    client: client,

    keyExists: function (key) {
        return client.exists(key, function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result) {
                return Boolean(result);
            }
        });

    },

    setValue: function (dbKey, dbValue) {
        return client.set(dbKey, dbValue, redis.print);
    },
    getValue: function (dbKey) {

        let sendBack = null;

        sendBack = client.get(dbKey, function (error, result) {
            if (error) {
                console.log(error);
                throw error;
            }
            if (result) {
                if (typeof result === 'string') {
                    return result;
                }
            }
        });

        return sendBack;

    },
    increaseValue: function (dbKey, addedValue) {

        if (this.keyExists(dbKey)) {
            return client.incrby(dbKey, addedValue, function (err, result) {
                return result;
            });

        } else {
            this.setValue(dbKey, addedValue);
            return addedValue;
        }

    }

};



