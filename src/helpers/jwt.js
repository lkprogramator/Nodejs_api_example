const expressJwt = require('express-jwt');
const authJson = require('../config/auth.json');

module.exports = jwt;

function jwt() {
    const { secret } = authJson;
    return expressJwt({ secret }).unless({
        path: [
            // public routes that don't require authentication
            '/users/authenticate'
        ]
    });
}
