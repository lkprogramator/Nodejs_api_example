const express = require('express');
const router = express.Router();

const trackService = require('../services/track.service');

router.post('/', function (req, res, next) {

    try {

        let resBody = {};

        let reply = trackService.processRequest(req.body);

        if (reply) {
            res.status(200);
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
