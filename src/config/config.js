
module.exports = {
    pathToDataStorageFile: 'public/data/dataStorage.txt',
    redisSetting: {
        host: '127.0.0.1',
        port: '6379'
    },
    dbCounterName: 'count',
    requestCounterName: 'count',

    getDataStorageLocation: function () {
        return this.pathToDataStorageFile;
    }

};
