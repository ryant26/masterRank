const request = require('request-promise');
const config = require('config');
const jwt = require('jsonwebtoken');

const authUrl = `${config.get('authenticationApi.baseUrl')}:${config.get('authenticationApi.port')}${config.get('authenticationApi.endpoint')}`;

let authenticate = function(tokenString) {
    return request({url: authUrl,
        method: 'POST',
        body: {token: tokenString},
        json: true})
        .then(() => {
            return jwt.decode(tokenString);
        });
};

module.exports = {
    authenticate
};