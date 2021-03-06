const express = require('express');
const router = express.Router();

const userService = require('../services/user.service');

router.get('/', function (req, res, next) {

    try {

        userService.getAll()
            .then(users => res.json(users))
            .catch(err => next(err));

    } catch (e) {
        console.log('Error:', e.stack);
    }

});

router.post('/authenticate', function authenticate(req, res, next) {
    userService.authenticate(req.body)
        .then(user => user ? res.json(user) : res.status(400).json({message: 'Username or password is incorrect'}))
        .catch(err => next(err));
});

module.exports = router;
