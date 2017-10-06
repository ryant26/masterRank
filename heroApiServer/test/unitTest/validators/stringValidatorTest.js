const sinon = require('sinon');
const assert = require('chai').assert;
const validators = require('../../../src/validators/stringValidator');


describe('stringValidator', function() {
    let sandbox = sinon.sandbox.create();

    afterEach(function() {
        sandbox.restore();
    });

    describe('allValidators', function () {
        it('should catch non strings', function() {
            assert.isFalse(validators.allValidators(null));
            assert.isFalse(validators.allValidators(undefined));
            assert.isFalse(validators.allValidators(1));
            assert.isFalse(validators.allValidators({}));
            assert.isFalse(validators.allValidators(function() {}));
        });

        it('should catch strings of length 0', function() {
            assert.isFalse(validators.allValidators(''));
        });

        it('should pass a valid string', function() {
            assert.isTrue(validators.allValidators('This string is fine'));
        });
    });
});