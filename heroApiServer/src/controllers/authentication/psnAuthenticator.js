const localAuthenticator = require('./common/localAuthenticator');

module.exports = localAuthenticator.strategy({
    name: 'psnAuth',
    platform: 'psn'
});