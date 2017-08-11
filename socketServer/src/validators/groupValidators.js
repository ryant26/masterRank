let logger = require('winston');

/**
 * This function checks if the passed ID is in the pending members list of the passed group details
 * object. Throws an exception if not found.
 * @param details - group details
 * @param id - battleNetIdToTest
 */
let idInPending = function (details, id) {
    let found = details.pending.find((element) => {
        return element.battleNetId === id;
    });

    if (!found) {
        logger.error(`Did not find ${id} in group pending`);
        throw 'Hero not invited to group';
    }
};

/**
 * This function checks that the passed id is the leader of the passed group details object
 * @param details - group details
 * @param id - battleNetId
 */
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

