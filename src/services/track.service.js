const path = require('path');
const redisService = require('./redis.service');
const fileStorageService = require('./fileStorage.service');
const storageItem = require('../model/makeStorageItem');
const config = require('../config/config');

module.exports = {

    processRequest: function (reqBody) {

        try {

            const requestCounterName = config.requestCounterName;

            if (reqBody.hasOwnProperty(requestCounterName)) {
                this.increaseCounter(reqBody[requestCounterName])
            }

            return this.saveStorageItem(this.makeStorageItem(reqBody)).then(function (result) {

                return result;
            }, function (err) {
                console.log('Error,Save data to storage', err);
            });

        } catch (e) {
            console.log('Error:', e.stack);
        }

    },

    increaseCounter: function (byValue) {

        try {
            return redisService.increaseValue(config.dbCounterName, byValue);
        } catch (e) {
            console.log('Error, increase of counter in db failed:', e.stack);
        }

    },

    makeStorageItem: function (dataToStore) {

        try {
            return storageItem.makeStorageItem(dataToStore);

        } catch (e) {
            console.log('Error in prepareForStorage:', e.stack);
        }

    },

    saveStorageItem: function (itemToStore) {

        try {

            return new Promise((resolve, reject) => {
                fileStorageService.saveToTheEnd(path.join(__dirname, '../../' + config.getDataStorageLocation()), JSON.stringify(itemToStore))
                    .then((isSaved) => {
                        resolve(isSaved);
                    }, reject);
            });

        } catch (e) {
            console.log('Error when saving Item into storage:', e.stack);
        }

    },


};
