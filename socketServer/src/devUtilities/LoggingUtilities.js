let listOfObjectsToString = function (list, key) {
    let out = '';

    for (let value of list) {
        if (key) out += `${value[key]} `;
        else out += `${value} `;
    }

    return out.trim();
};

module.exports = {
    listOfObjectsToString
};