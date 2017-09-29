const localAuthenticator = require('./common/localAuthenticator');

module.exports = localAuthenticator.strategy({
    name: 'xblAuth',
    platform: 'xbl'
});