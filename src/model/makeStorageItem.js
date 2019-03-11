function setTimestamp() {
    return Math.floor(Date.now() / 1000);
}


module.exports = {
    makeStorageItem: function (content) {

        const storageItem = {};
        storageItem.timestamp = setTimestamp();
        storageItem.content = content;

        return storageItem;

    }
};
