let validators = {
    isString: function(arg) {
        return typeof arg === 'string';
    },

    isNotEmpty: function(arg) {
        return arg.length !== 0;
    }
};


let allValidators = function(arg) {
    let result = true;

    for (let keyVal of Object.entries(validators)) {
        let validator = keyVal[1];
        result = result && validator(arg);
    }

    return result;
};

let out = Object.assign({}, validators);
out.allValidators = allValidators;

module.exports = out;
