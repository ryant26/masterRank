const localAuthenticator = require('./common/localAuthenticator');

module.exports = localAuthenticator({
    name: 'psnAuth',
    platform: 'psn'
});