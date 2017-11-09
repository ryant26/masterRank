const logger = require('../services/logger').sysLogger;

let playerValidator = function(player) {
    if (!player.level) {
        logAttributeWarning('player', 'level');
        player.level = 0;
    }

    if (!player.portrait) {
        logAttributeWarning('player', 'portrait');
        player.portrait = '';
    }
};

let careerValidator = function(herosDetails) {
    if (!herosDetails.stats) {
        logAttributeWarning('hero', 'stats');
        throw new Error('Malformed return from ow API');
    }
};

let heroValidator = function(hero) {
    let attributes = ['combat', 'hero', 'assists', 'game', 'misc'];
    attributes.forEach((attribute) => {
        if (!hero[attribute]) {
            logAttributeWarning('hero', attribute);
            hero[attribute] = {};
        }
    });
};

let logAttributeWarning = function(type, attribute) {
    logWarning(`${type} did not have '${attribute}' attribute`);
};

let logWarning = function(message) {
    logger.warn(`Malformed return from ow API: ${message}`);
};

module.exports = {
    playerValidator,
    heroValidator,
    careerValidator
};