const localAuthenticator = require('./common/localAuthenticator');

module.exports = localAuthenticator({
    name: 'xblAuth',
    platform: 'xbl'
});