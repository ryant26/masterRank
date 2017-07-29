let logger = require('winston');

let idInPending = function (details, id) {
    let found = details.pending.find((element) => {
        return element.battleNetId === id;
    });

    if (!found) {
        logger.error(`Did not find ${id} in group pending`);
        throw 'Not found in pending';
    }
};

let idIsLeader = function (details, id) {
    if (details.leader.battleNetId !== id) {
        logger.error(`${id} is not the leader of group ${details.groupId}`);
        throw 'Unauthorized';
    }
};

module.exports = {
    idInPending,
    idIsLeader
};

