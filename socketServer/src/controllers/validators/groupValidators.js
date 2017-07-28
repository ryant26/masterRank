let logger = require('winston');

let idInPending = function (details, id) {
    let found = details.pending.find((element) => {
        element.battleNetId === id;
    });

    if (!found) {
        logger.error(`Did not find ${id} in group pending`);
        throw 'Not found in pending';
    }
};

module.exports = {
    idInPending
};

