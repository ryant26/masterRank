let validators = {
    isNumber: function(arg) {
        return typeof arg === 'number';
    },

    isLessThan: function(arg, limit) {
        return arg <  limit;
    },

    isGreaterThan: function(arg, limit) {
        return arg > limit;
    }
};


let allValidators = function(number, lowerLimit, upperLimit) {
    return validators.isNumber(number) &&
        validators.isGreaterThan(number, lowerLimit) &&
        validators.isLessThan(number, upperLimit);
};

let out = Object.assign({}, validators);
out.allValidators = allValidators;

module.exports = out;
