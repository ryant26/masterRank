const assert = require('chai').assert;

describe('This is a multi node suite', function() {
    it('should pass', function() {
        assert(true);
    });

    it('should fail', function() {
        assert(false);
    });
});