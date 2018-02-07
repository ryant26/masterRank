let chainableValidators = {
    isString: function(arg) {
        return typeof arg === 'string';
    },

    isNotEmpty: function(arg) {
        return arg.length !== 0;
    }
};

let nonChainableValidators = {
    equalIgnoreCase: function(arg, testString) {
        return arg.toLowerCase() === testString.toLowerCase();
    }
};


let allValidators = function(...args) {
    let result = true;

    for (let keyVal of Object.entries(chainableValidators)) {
        let validator = keyVal[1];
        args.forEach((arg) => {
            result = result && validator(arg);
        });
    }

    return result;
};

let out = Object.assign({}, chainableValidators, nonChainableValidators);
out.allValidators = allValidators;

module.exports = out;
