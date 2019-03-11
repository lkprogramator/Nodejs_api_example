const fs = require('fs');
const path = require('path');

module.exports = {

    insureTheFileExists: function (filePath) {
        if (!fs.existsSync(filePath)) {
            fs.closeSync(fs.openSync(filePath, 'w'));
        }
    },

    saveToTheEnd: function (filePath, addData) {

        try {

            this.insureTheFileExists(filePath);

            return new Promise((resolve, reject) => {

                let accessLogStream = fs.createWriteStream(filePath, {flags: 'a'});

                accessLogStream.on("finish", () => {
                    resolve(true);
                });
                accessLogStream.on("error", reject);

                accessLogStream.write(',\r');
                accessLogStream.end(addData);

            });

        } catch (e) {
            console.log('Error when saving to the end of file:', e.stack);
        }

    }

};
