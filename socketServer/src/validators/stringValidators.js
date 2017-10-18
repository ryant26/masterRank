let validators = {
    validateType: function(arg) {
        return typeof arg === 'string';
    },

    validateNotEmpty: function(arg) {
        return arg.length > 0;
    }
};


let runAllValidators = function (arg) {
    let valid = true;

    Object.keys(validators).forEach((key) => {
        valid = valid && validators[key](arg);
    });

    return valid;
};

let out = Object.assign({}, validators);

out.runAllValidators = runAllValidators;
module.exports = out;