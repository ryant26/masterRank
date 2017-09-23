const passport = require('passport');
const util = require('util');

function StrategyMock(options, verify) {
    this.name = 'mock';
    this.passAuthentication = options.passAuthentication || true;
    this.battletag = 'someTag';
    this.verify = verify;
}

util.inherits(StrategyMock, passport.Strategy);

StrategyMock.prototype.authenticate = function authenticate() {
    if (this.passAuthentication) {
        let profile = {
            battletag: this.battletag
        };
        let self = this;
        this.verify(null, null, profile, function(err, resident) {
            if(err) {
                self.fail(err);
            } else {
                self.success(resident);
            }
        });
    } else {
        this.fail('Unauthorized');
    }
};

module.exports = StrategyMock;