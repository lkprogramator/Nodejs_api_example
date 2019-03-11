const express = require('express');
const router = express.Router();

const countService = require('../services/count.service');
const config = require('../config/config');

router.get('/', function (req, res, next) {

    try {

        let resBody = {};
        let counterName = config.requestCounterName;

        let count = countService.processRequest();

        if (count) {
            resBody[counterName] = count;
            res.status(200).json(resBody);
        } else {
            resBody['error'] = 'Requested data not found';
            res.status(400).json(resBody);
        }

        res.send();
        next();

    } catch (e) {
        console.log('Error:', e.stack);
    }

});

module.exports = router;
